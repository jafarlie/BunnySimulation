class Meadow{

    constructor(){
        this.grid = this.makeGrid();
    }

    makeGrid(){
        let grid = new Array(30);
        for(var i=0; i < 30; i++){
            grid[i] = new Array(30).fill(null);
        }
        return grid;
    }

    checkElementExists(coordinates){ 
        if(this.grid[coordinates[0]][coordinates[1]] instanceof Plant){
            return true;
        }else{
            return false;
        }
    }
    
    growAPlant(){
        let plant = new Plant();
        let coord = plant.generateCoordinateInMeadow();
        

        let cond = this.checkElementExists(coord);

        while(cond === true){
            coord = plant.generateCoordinateInMeadow();
            cond = this.checkElementExists(coord);
            
        }

        this.grid[coord[0]][coord[1]] = plant;

    }

    removeObjectAtGivenCoord(coordinates){
        this.grid[coordinates[0]][coordinates[1]] = null;
    }

    checkIfBunnyEats(coordinateArray){
        if(this.checkElementExists(coordinateArray)){
            this.removeObjectAtGivenCoord(coordinateArray);
            return true;
        }else{
            return false;
        }
    }

    checkValidBunnyMove(coordinates){ 
        if(this.grid[coordinates[0]] !== undefined){
            if(this.grid[coordinates[1]] !== undefined){
                return true;
            }else{
                return false;
            }        
        }else{
            return false;
        }
    }
}

let m = new Meadow();

console.log(m.checkValidBunnyMove([4,30]));



