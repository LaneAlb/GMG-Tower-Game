class Title extends Phaser.Scene {
    constructor() {
        super('title');
    }

    create() {
        this.brainpower = true;
        this.movementVelocity = 200;
        this.currTime = this.time.now;
        this.lastTime = -1000;
        // Text Bubbles Prefab
        this.tb = this.add.group(this);
        this.boxMsgs = new TextBubbles();
        // background music
        backmusic = this.sound.add('runmp3',{
            mute: false,
            volume: 0.7,
            rate: 0.5,
            loop:true
        });
        if(!backmusic.isPlaying){
            backmusic.play();
        }
        // Background
        // Loading Tilemap
        this.map     = this.make.tilemap({key: 'MainMenu'});
        this.tileset = this.map.addTilesetImage('tilemap 2');
        this.map.createLayer('BG', this.tileset, 0, 0); 
        this.floor        = this.map.createLayer('Ground', this.tileset, 0, 0); // make ground walkable
        this.foreground   = this.map.createLayer('Foreground', this.tileset, 0, 0);
        this.map.createLayer('Heart and Brain', this.tileset, 0, 0);
        this.map.createLayer('Pipes', this.tileset, 0, 0);
        this.climbable    = this.map.createLayer('Ladders', this.tileset, 0, 0);       // climbable objects
        this.power        = this.map.createLayer('Inital State', this.tileset, 0, 0);  // info graphics "on"
        this.noPower      = this.map.createLayer('Power off', this.tileset, 0, 0);
        const bounds      = this.map.createLayer('Ground for the Camera', this.tileset, 0, 0);

        const spawnPoint  = this.map.findObject("Spawns", obj => obj.name == "START");        // grab spawn info
        this.noPower.visible = false;
        // for ease of use
        this.tileHeight = this.map.tileHeight;
        this.tileWidth  = this.map.tileWidth;
        this.mapHeightP = this.map.heightInPixels;
        this.mapWidthP  = this.map.widthInPixels;
        //console.log("TileMap Info: W/H" + this.mapHeightP + " , " + this.mapWidthP);
        //console.log("Tile W/H: " + this.tileHeight + " , " + this.tileWidth);

        // Title Txt
        this.add.text(10*this.tileWidth, 6*this.tileHeight, 'Living Demolition', headerConfig).setOrigin(0.5);
        this.add.text(10*this.tileWidth, 6*this.tileHeight + 32, 'Use your mouse to Interact with Panels', bodyConfig).setOrigin(0.5);
        this.add.text(46, gameH - txtSpacing/2, 'GMG 2021', bodyConfig).setOrigin(0.5).setScrollFactor(0);
        this.add.text(75, gameH - txtSpacing/4, 'Font by Style-7', bodyConfig).setOrigin(0.5).setScrollFactor(0);

        // interaction setup
        this.controlsAttention = this.add.rectangle(5*this.tileWidth, this.mapHeightP - 2*this.tileHeight, 128, 128);//, 0xFFFFF, 1);
        this.controlsAttention.setInteractive({cursor: 'url(./assets/pointers/InfoPointer.png), pointer'}).on('pointerdown', () => 
        { if(this.brainpower == false){this.textbox(player.x, player.y, 'noPower');
                this.time.delayedCall(2500, () => { this.tb.clear(true, true); });}
        else{backmusic.stop(); this.scene.start('controls');//this.controls();
        } });

        this.startAttention = this.add.rectangle(10*this.tileWidth, this.mapHeightP - 2*this.tileHeight, 128, 128);//, 0xFFFFF, 1);
        this.startAttention.setInteractive({cursor: 'url(./assets/pointers/InfoPointer.png), pointer'}).on('pointerdown', () => 
        {if(this.brainpower == false){this.textbox(player.x, player.y, 'noPower');
            this.time.delayedCall(2500, () => { this.tb.clear(true, true); });}
        else{backmusic.stop(); this.scene.start('select');}});

        this.creditsAttention = this.add.rectangle(this.mapWidthP - 5*this.tileWidth, this.mapHeightP - 2*this.tileHeight, 128, 128);//, 0xFFFFF, 1);
        this.creditsAttention.setInteractive({cursor: 'url(./assets/pointers/InfoPointer.png), pointer'}).on('pointerdown', () => 
        {if(this.brainpower == false){this.textbox(player.x, player.y, 'noPower');
            this.time.delayedCall(2500, () => { this.tb.clear(true, true); });}
        else{backmusic.stop(); this.scene.start('staticCredits');}});

        this.lever = this.add.rectangle(6.5*this.tileWidth, 2.5*this.tileHeight, 64, 64);//, 0xFFFFF, 1);
        this.lever.setInteractive({cursor: 'url(./assets/pointers/LevelPointer.png), pointer'}).on('pointerup', () => {
            this.power.visible = true;;
            if(!this.noPower.visible){ // if power is ON
                this.powerDown = this.sound.add('poweringDown')
                this.powerDown.play();
                this.brainpower = false;
                this.noPower.setVisible(true);
                this.power.setVisible(false);
            } else{ // let the player turn power back on
                this.powerUp = this.sound.add('poweringUp')
                this.powerUp.play();
                this.brainpower = true;
                this.noPower.setVisible(false);
                this.power.setVisible(true);
            }
        });
        this.leverbutton = this.add.rectangle(6.5*this.tileWidth, 3.5*this.tileHeight, 64, 64);//, 0xFFFFF, 1);
        this.leverbutton.setInteractive({cursor: 'url(./assets/pointers/InfoPointer.png), pointer'}).on('pointerover', () => {
            if(this.brainpower == false){this.textbox(player.x, player.y, 'noPower');}
            else{this.textbox(player.x, player.y, 'lever');}
        });
        this.leverbutton.on('pointerout', () => {
            this.tb.clear(true, true);
        });

        this.falseButton = this.add.rectangle(12.5*this.tileWidth, this.mapHeightP - 6.5*this.tileHeight, 64, 64,);//0xFFFFF, 1);
        this.falseButton.setInteractive({cursor: 'url(./assets/pointers/InfoPointer.png), pointer'}).on('pointerover', () => { if(this.brainpower == false){this.textbox(player.x, player.y, 'noPower');}
        else{this.textbox(player.x, player.y, 'buttonFalse');}
        });
        this.falseButton.on('pointerout', () => {
            this.tb.clear(true, true);
        });

        this.elevatorButton = this.add.rectangle(2.5*this.tileWidth, this.mapHeightP - 1.5*this.tileHeight, 64, 64);//, 0xFFFFF, 1);
        this.elevatorButton.setInteractive({cursor: 'url(./assets/pointers/InfoPointer.png), pointer'}).on('pointerover', () => {
            if(this.brainpower == false){this.textbox(player.x, player.y, 'noPower');}
            else{this.textbox(player.x, player.y, 'elevator');}
        });
        this.elevatorButton.on('pointerout', () => {
            this.tb.clear(true, true);
        });

        this.brainObject = this.add.rectangle(9.5*this.tileWidth, 2.5*this.tileHeight, 192, 192);//0xFFFFF, 1);
        this.brainObject.setInteractive({cursor: 'url(./assets/pointers/BrainPointer.png), pointer'});
        this.brainObject.on('pointerup', () => {
            if(this.brainpower == true){
                this.brainsound= this.sound.add('brainsfx'),
                this.brainsound.play()}
            this.time.delayedCall(2500, () => { this.tb.clear(true, true); }); });

        // give platforms scene, x, y, endPoint, velocity, texture)
        this.upPlatforms = new UpwordsPlat(this, this.tileWidth, this.mapHeightP - 2*this.tileHeight, 3*this.tileHeight, this.movementVelocity, 'mPlat').setOrigin(0);        
        this.upPlatforms.setScale(0.5);

        // player stuff here
        let frameNames = this.anims.generateFrameNames('worker',{
            start: 1, end: 8, prefix: 'worker'
        });
        this.anims.create({
            key: 'run',
            frames: frameNames,
            frameRate: 20,
            repeat: -1
        });
        player = new Player(this, spawnPoint.x, spawnPoint.y - 64, 'worker', 0);
        player.setScale(0.6); // the character is a tad big compared to tiles
        player.anims.play('run');
        //console.log(player.alpha);
        //camera things
        //configuration
        this.cameras.main.setBounds(0,0,this.mapWidthP,this.mapHeightP);
        this.cameras.main.setZoom(1);
        //have the camera follow the player
        this.cameras.main.startFollow(player);
        // setup collisions anything not of index below has collision ON
        this.floor.setCollisionByExclusion(-1, true);
        this.climbable.setCollisionByExclusion(-1, true);
        bounds.setCollisionByExclusion(-1, true);
        // setup world collliders
        this.physics.add.collider(bounds, player);
        this.physics.add.collider(this.floor, player);
        this.physics.add.overlap (this.climbable, player);
        this.physics.add.collider(this.upPlatforms, player);
        // set up cursor keys for title screen input
        movement = this.input.keyboard.addKeys({up:"W",down:"S",left:"A",right:"D", jump:"SPACE", esc: "ESC"});
    }

    update() {
        player.update();
        this.upPlatforms.update();
        this.currTime = this.time.now; //update current time
        if(movement.left.isUp && movement.right.isUp){
            player.anims.play('run');
        }
        if(movement.jump.isDown && this.currTime - this.lastTime >= 1000){ // make jump only once
            player.jump();
            this.lastTime = this.currTime;
        }
        if(this.climbable.getTileAtWorldXY(player.x, player.y)) 
        {
            player.climb();
        }
        if(this.popup && movement.esc.isDown){
            this.popup.clear(true, true);
            backmusic.play();
        }
    }

    textbox(x, y, objName){
        //console.log("Txtbox being made for:" + objName);
        let height = Phaser.Math.FloorTo((this.boxMsgs.messageLength(objName) * 16) / 100 );
        //console.log("Expected wordWrap == " + height);
        this.txtstyle = {
            fontFamily: 'thinPixel', 
            fontSize: '32px',
            color: '#FFFFFF',
            strokeThickness: 1,
            stroke: '#000000',
            align: 'center',
            fixedWidth:  100,
            wordWrap: {width: 100}, // keep width the same as fixedWidth
        }
        // X is center of camera - width of message above
        // Y is based on the current scroll factor of the camera
        // if the scroll factor is > 0 or < gameH then we know the character is center of camera
        // else he is either near the top or bottom respectively

        if(this.cameras.main.scrollY < 160 && this.cameras.main.scrollY > 0){
            y = this.cameras.main.centerY / 2 - (2*height);
        } else if (this.cameras.main.scrollY == 0){
            y = this.cameras.main.centerY / 2 - 1.2*height; // give some room above player head by padding height
        } else { // camera at bottom of the map, character is there too
            y = this.cameras.main.centerY;
        }
        let txt = this.add.text(this.cameras.main.centerX - 50, y, this.boxMsgs.messageFind(objName), this.txtstyle).setScrollFactor(0).setDepth(1);
        let bckg = this.add.rectangle(this.cameras.main.centerX - 50, y, txt.displayWidth, txt.displayHeight, 0x545454, 1).setOrigin(0,0).setScrollFactor(0);
        bckg.setStrokeStyle(2, 0xAF2A20);
        this.tb.add(bckg);
        this.tb.add(txt);
    }

    controls(){
        this.popup = this.add.group();
        let back   = this.add.rectangle(centerX, centerY, 550, 475, 0x525252, 1).setOrigin(0.5).setScrollFactor(0);
        back.setStrokeStyle(10, 0xAF2A20);
        let txt    = this.add.text(centerX, centerY, "Controls\nW\nA S D\nJump: Space\nInteract: Mouse1\nEsc to close", buttonConfg).setOrigin(0.5).setScrollFactor(0);
        this.popup.add(back);
        this.popup.add(txt);
    }
}