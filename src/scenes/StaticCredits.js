class StaticCredits extends Phaser.Scene {
    constructor() {
        super('staticCredits');
    }

    create() {
        // score text flying across screen
        let gmg = this.add.text(centerX, centerY - 2*txtSpacing, `GMG Living Demo By:`, titleConfig).setOrigin(0.5);
        let peeps = this.add.text(centerX, centerY, `Coding & Cursors: Lane\nLevel Design & Art: Josh\nArt & Sound: Mikayla`, headerConfig).setOrigin(0.5);
        this.add.text(centerX, gameH - txtSpacing, 'Esc to go back to the Menu', bodyConfig).setOrigin(0.5);
        // set up cursor keys for title screen input
        this.selectors = this.input.keyboard.addKeys({esc:"ESC"});
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.selectors.esc)) {
            // start play scene
            this.scene.start('title');
        }
    }
}