import { Orientation } from '../geometry/orientation';
import { Player } from './Player';
import { ASSETS } from '../constants/assets';

const ARROW_SPEED = 150;

/**
 * 무기 선연 - 스프라이트
 */
export class Arrow extends Phaser.Physics.Arcade.Sprite {
  public scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, player: Player, direction: Orientation) {
    // player x, y 좌표를 받는건, player 좌표에서 무기가 나가야 함으로
    super(scene, player.x, player.y, ASSETS.IMAGES.ARROW);
    this.scene = scene;

    this.scene.physics.add.existing(this); // 물리 바디 추가
    this.scene.add.existing(this); // 게임 오브젝트 추가

    this.setDepth(1000);

    switch (direction) {
      case Orientation.Up:
        this.setVelocityY(-ARROW_SPEED);
        break;
      case Orientation.Down:
        this.setVelocityY(ARROW_SPEED);
        this.setRotation(Math.PI);
        break;
      case Orientation.Left:
        this.setVelocityX(-ARROW_SPEED);
        this.setRotation(-Math.PI / 2);
        break;
      case Orientation.Right:
        this.setVelocityX(ARROW_SPEED);
        this.setRotation(Math.PI / 2);
        break;
      default:
        break;
    }
  }
}
