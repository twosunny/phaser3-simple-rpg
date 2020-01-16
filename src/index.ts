import 'phaser';
import { FirstLevel } from './scenes/FirstLevel';
import { SecondLevel } from './scenes/SecondLevel';
import { Preloader } from './scenes/Preloader';
import { GameManager } from './scenes/GameManager';
import { HUD } from './scenes/HUD';

/**
 * Game 초기 진입점
 */
class PhaserGame extends Phaser.Game {
  constructor() {
    //게임 config 설정
    const config = {
      type: Phaser.AUTO, // Canvas, WebGL 두가지 분류가 있는데 브라우저에 맞게 자동으로 설정
      parent: 'game-container', // html의 어디에다가 게임을 그릴지 dom id 설정
      width: 400, // 가로 해상도
      height: 250, // 세로 해상도
      zoom: 2.5, // 줌인 배율
      pixelArt: true,
      physics: {
        default: 'arcade',
        // arcade: {
        //   debug: true,
        // },
      },
      // 씬 정보들 세팅
      scene: [Preloader, FirstLevel, SecondLevel, GameManager, HUD],
    };
    super(config);
  }
}

// tslint:disable-next-line
new PhaserGame(); // 게임 실행
