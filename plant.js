function Plant(){
    this.currXCoord = null;
    this.currYCoord = null;

    this.generateCoordinateInMeadow = () => {
        let randomX = this.getRandomCoordinate(0, 29);
        let randomY = this.getRandomCoordinate(0, 29);
        this.currXCoord = randomX;
        this.currYCoord  = randomY;
        return [this.currXCoord, this.currYCoord];
    };
    this.getRandomCoordinate = function(min, max) {
        // Think about this function, it should generate random number according to the coord system
        min = Math.ceil(min);
        max = Math.floor(max);
        let val = Math.floor(Math.random() * (max - min + 1)) + min;
        return val;
    };
}