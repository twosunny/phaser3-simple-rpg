import { Orientation } from '../geometry/orientation';
import { Character } from './Character';
import { ASSETS } from '../constants/assets';

/**
 * 몬스터 정의
 */
export abstract class Monster extends Character {
  private static WANDER_DELAY = () => 1000 + 1000 * Math.random();
  private static WANDER_LENGTH = () => 1000 + 5000 * Math.random();

  protected abstract WALK_ANIMATION;
  protected abstract MONSTER_IDLE_DOWN;
  protected MONSTER_SPEED = 20;
  protected MONSTER_HIT_DELAY = 100;
  protected CHASING_DISTANCE = 100; // 플레이어와 몬스터간의 추적 기준 거리

  protected hp: number;
  private chasingPlayerTimerEvent: Phaser.Time.TimerEvent;
  private isWandering = false;
  private isStartled = false;

  public updateMonster() {
    if (!this.active) {
      return;
    }
    this.handleChase();
  }

  public attack = () => {
    if (!this.scene.player.canGetHit()) {
      return;
    }

    this.scene.player.loseHp();
    this.animateAttack();
  };

  public loseHp = (projectile: Phaser.Physics.Arcade.Sprite) => {
    this.hp--;
    this.isStartled = true;
    this.setTint(0xff0000);
    this.scene.time.addEvent({
      delay: this.MONSTER_HIT_DELAY,
      callback: () => this.clearTint(),
      callbackScope: this,
    });
    projectile.destroy();
    if (this.hp === 0) {
      this.die();
    }
  };

  protected abstract animateAttack(): void;

  private die = () => {
    const deathAnim = this.scene.add.sprite(this.x, this.y, ASSETS.IMAGES.MONSTER_DEATH);
    this.destroy();
    deathAnim.play(ASSETS.ANIMATIONS.MONSTER_DEATH, false);
  };

  // 추적 할지 안할지 정의
  private shouldChase = () => {
    const playerPoint = this.scene.player.getCenter(); // 플레이어 위치
    const monsterPoint = this.getCenter(); // 몬스터 위치
    const distance = monsterPoint.distance(playerPoint); // 플레이어와 몬스터의 거리

    //추적 범위안에 있다면 추적을 한다
    if (distance < this.CHASING_DISTANCE) {
      return true;
    }

    if (this.isStartled) {
      return true;
    }

    return false;
  };

  private getOrientationFromTargettedPosition(x: number, y: number): Orientation {
    if (Math.abs(y) > Math.abs(x)) {
      return y < 0 ? Orientation.Up : Orientation.Down;
    }

    return x < 0 ? Orientation.Left : Orientation.Right;
  }

  /**
   * 몬스터가 플레이어 추적하는 로직
   */
  private moveTowardsPlayer() {
    if (!this.active) {
      return;
    }

    const playerPoint = this.scene.player.getCenter();
    const monsterPoint = this.getCenter();
    const { x, y } = playerPoint.subtract(monsterPoint);

    this.run(x, y);
  }

  private run(x: number, y: number) {
    if (x === 0 && y === 0) {
      return;
    }

    if (!this.active) {
      return;
    }

    this.setVelocityX(Math.sign(x) * this.MONSTER_SPEED);
    this.setVelocityY(Math.sign(y) * this.MONSTER_SPEED);

    const orientation = this.getOrientationFromTargettedPosition(x, y);

    this.animate(this.WALK_ANIMATION, orientation);
  }

  private stopRunning() {
    if (!this.active) {
      return;
    }

    this.setVelocity(0);
    this.beIdle();
  }

  /**
   * 몬스터가 플레이어를 추적하도록 이벤트 설정
   */
  private startChasing() {
    this.chasingPlayerTimerEvent = this.scene.time.addEvent({
      delay: 500,
      callback: this.moveTowardsPlayer,
      callbackScope: this,
      repeat: Infinity,
      startAt: 2000,
    });
  }

  private beIdle() {
    this.play(this.MONSTER_IDLE_DOWN);
  }

  private stopChasing() {
    if (this.active) {
      this.stopRunning();
    }
    this.chasingPlayerTimerEvent.destroy();
    this.chasingPlayerTimerEvent = null;
  }

  private handleChase() {
    if (!this.chasingPlayerTimerEvent && this.shouldChase()) {
      this.startChasing();
      return;
    }

    if (this.chasingPlayerTimerEvent && !this.shouldChase()) {
      this.stopChasing();
    }

    if (!this.shouldChase()) {
      this.wanderAround();
    }
  }

  private wanderAround() {
    if (this.isWandering) {
      return;
    }

    this.isWandering = true;

    const direction = this.getRandomDirection();
    this.run(direction.x, direction.y);

    this.scene.time.addEvent({
      delay: Monster.WANDER_LENGTH(),
      callbackScope: this,
      callback: () => {
        this.stopRunning();

        if (!this.active) {
          return;
        }

        this.scene.time.addEvent({
          delay: Monster.WANDER_DELAY(),
          callbackScope: this,
          callback: () => {
            this.isWandering = false;
          },
        });
      },
    });
  }

  private getRandomDirection() {
    const randomBetweenMinusOneAndOne = () => Math.round(2 * Math.random()) - 1;
    const x = randomBetweenMinusOneAndOne();
    const y = randomBetweenMinusOneAndOne();

    return { x, y };
  }
}
