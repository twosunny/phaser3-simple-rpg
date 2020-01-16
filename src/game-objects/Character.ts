import { Orientation } from '../geometry/orientation';
import { AbstractScene } from '../scenes/AbstractScene';
import { SCENES } from '../constants/scenes';
import { GameManager } from '../scenes/GameManager';

type CharacterAnimation = {
  [K in Orientation]: {
    flip: boolean;
    anim: string;
  };
};

/**
 * 게임 캐릭터를 구성하기 위한 추상 클래스
 */
export abstract class Character extends Phaser.Physics.Arcade.Sprite {
  protected scene: AbstractScene; //호출되는 맵
  protected uiScene: GameManager; // 맵 위에 그려지는 또다른 조작 UI 씬

  constructor(scene: AbstractScene, x: number, y: number, sprite: string) {
    super(scene, x, y, sprite, 0);
    this.scene = scene; // 현재 맵
    // 주어진 게임 오브젝트에 동적 물리 바디를 추가합니다. 이걸 제거 하면 map 전체가 안나오는데 왜지???
    this.scene.physics.add.existing(this);
    // 현재 맵에 게임 오브젝트로 추가함 --> 실제로 맵에 표시됨
    this.scene.add.existing(this);

    const uiScene: any = this.scene.scene.get(SCENES.GAME_MANAGER);
    this.uiScene = uiScene;
  }

  protected animate(animationKeys: CharacterAnimation, orientation: Orientation) {
    const { flip, anim } = animationKeys[orientation];
    this.setFlipX(flip); // 게임 오브젝트의 수평으로 뒤집힌 상태 정의
    this.play(anim, true); // 애니메이션 플레이
  }
}
