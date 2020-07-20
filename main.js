let compost = Math.round(JSON.parse(localStorage.getItem('currentCompost')));
let cash = Math.round(JSON.parse(localStorage.getItem('currentCash')));
let squares = JSON.parse(localStorage.getItem('currentSquares')); 
let time = JSON.parse(localStorage.getItem('timeSpeed')); 
let selectedID = null;
let image = null;
let oneDay = (1000*60*60*24);
function Square(name, timeStamp, crop) {
    this.name = name;
    this.timeStamp = timeStamp;
    this.crop = crop;
}
let cropArray = [
    {cropName: 'empty', sproutImage: 'images/none.png', cropImage: 'images/none.png', rotten: 'images/rotten.png', minHarvest: null, maxHarvest: null, yieldRate: 0},
    {cropName: 'tomato', sproutImage: 'images/sprout.png', cropImage: 'images/tomato.png', rotten: 'images/rotten.png', minHarvest: (1000*60*60*24*8), maxHarvest: (1000*60*60*24*12), cost: 10, yieldRate: .5},
    {cropName: 'broccoli', sproutImage: 'images/sprout.png', cropImage: 'images/broccoli-2.png', rotten: 'images/rotten.png', minHarvest: (1000*60*60*24*4), maxHarvest: (1000*60*60*24*20), cost: 12, yieldRate: .4},
    {cropName: 'romaine', sproutImage: 'images/romaine-sprout.png', cropImage: 'images/romaine.png', rotten: 'images/rotten.png', minHarvest: (1000*60*60*24*1), maxHarvest: (1000*60*60*24*5), cost: 4, yieldRate: .6}
    ];

 
//SET SPEED OF TIME
function setTime(timeSelection) {
    localStorage.setItem('timeSpeed', timeSelection);
    document.getElementById('normal').setAttribute('class', 'time-btn');
    document.getElementById('fast').setAttribute('class', 'time-btn');
    document.getElementById('hyper').setAttribute('class', 'time-btn');
    document.location.reload(); 
     };

 if (time == 1) {
     document.getElementById('normal').setAttribute('class', 'selected-button');
 }
 if (time == 24) {
    document.getElementById('fast').setAttribute('class', 'selected-button');
}
 if (time == 1440) {
    document.getElementById('hyper').setAttribute('class', 'selected-button');
}

//RESET THE GARDEN  
document.getElementById('reset').addEventListener('click', function(event) {
    cash = 100;
    compost = 30;
    squares = [
        {name: 'plot0',
        timeStamp: null,
        crop: 'empty',
        },
    ];
    let JSONplot = JSON.stringify(squares);
    localStorage.setItem('timeSpeed', 1);
    localStorage.setItem('currentCash', cash);
    localStorage.setItem('currentCompost', compost);
    localStorage.setItem('currentSquares', JSONplot);
    document.getElementById('cash-amount').innerHTML = cash;
    document.getElementById('compost-amount').innerHTML = compost;
    location.reload();
});


document.getElementById("cash-amount").innerHTML = cash;
document.getElementById("compost-amount").innerHTML = compost;

//CREATE A PLOT AREA DIV TO CONTAIN SQUARES
let garden = document.getElementById('plot-area');
let plotArea = document.createElement('div');
plotArea.setAttribute('class', 'plot');
garden.appendChild(plotArea);


//FOR LOOP (BUILDS THE MATRIX OF PLOTS EVERY TIME PAGE IS LOADED)
for (i = 0; i < squares.length; i++) {
    squares[i].age = ((Date.now() - squares[i].timeStamp) / oneDay * time);
    squares[i].hydration = (100 - (((Date.now() - squares[i].lastWater) / oneDay * time * squares[i].yieldRate) * 50)).toFixed(0);
    if (squares[i].hydration <= 0) {
        squares[i].hydration = 0;
        squares[i].status = 'Dead';
    }
    if (squares[i].crop === 'empty') {
        squares[i].age = 'N/A';
        squares[i].yield = 'N/A';
        squares[i].status = 'N/A';
        squares[i].hydration = 0;
    }
    let square = document.createElement('div');
    let number = i;
    square.setAttribute('class', 'square');
    square.setAttribute('ID', number)
    plotArea.appendChild(square);
    let plotMenu = document.createElement('div');
    plotMenu.setAttribute('class', 'dropdown');
    plotMenu.setAttribute('ID', number);
    plotMenu.addEventListener('click', function(event) {
        let clickedSquare = event.target;
        selectedID = this.id;
        clickedSquare.setAttribute('class', 'selected');
    });
    plotMenu.addEventListener('mouseenter', function(event) {
        hoverSquare = event.target;
        let hoverID = this.id;
        if (squares[hoverID].crop === 'empty') {
            squares[hoverID].age = 'N/A';
        }
        else squares[hoverID].age = ((Date.now() - (squares[hoverID].timeStamp)) / oneDay * time).toFixed(1);
       
        squares[hoverID].yield = (squares[hoverID].age * squares[hoverID].yieldRate).toFixed(1);
      
        if (squares[hoverID].crop === 'empty') {
            squares[hoverID].status = 'N/A';
            squares[hoverID].yield = 'N/A';
        } else if (squares[hoverID].hydration === 0) {
            squares[hoverID].status = 'Dead';
        } else if ((((Date.now()) - squares[hoverID].timeStamp) * time) > squares[hoverID].maxHarvest) {
            squares[hoverID].status = 'Rotten';
        } else if (((Date.now() - squares[hoverID].timeStamp) * time) > squares[hoverID].minHarvest) {
            squares[hoverID].status = 'Bearing Fruit';
        } else if (((Date.now() - squares[hoverID].timeStamp) * time) < squares[hoverID].minHarvest) {
            squares[hoverID].status = 'Growing';
        } 

        document.getElementById('plot-id').innerHTML = 'Plot #' + hoverID;
        document.getElementById('crop-name').innerHTML = 'Crop: ' + squares[hoverID].crop;
        document.getElementById('crop-age').innerHTML = 'Age (days): ' + squares[hoverID].age;
        document.getElementById('crop-status').innerHTML = 'Status: ' + squares[hoverID].status;
        document.getElementById('water-health').innerHTML = 'Hydration: ' + squares[hoverID].hydration;
        document.getElementById('crop-yield').innerHTML = 'Yield (lbs): ' + squares[hoverID].yield;

        openCropInfo();
    });
        plotMenu.addEventListener('mouseleave', function() {
            closeCropInfo();
        });
    square.appendChild(plotMenu);
  }
     
//APPEND CURRENT IMAGE TO EACH RELEVANT PLOT
for (i = 0; i < squares.length; i++) {
        let cropID = squares[i].crop;
        let size = null;
        for (t = 0; t < cropArray.length; t++) {
            if (cropArray[t].cropName === cropID) {
                
                if (squares[i].status == 'Dead') {
                    image = cropArray[t].rotten;
                    size = 'large'; 
                }
                else if (((Date.now() - squares[i].timeStamp)) * time < squares[i].minHarvest) {
                    size = 'small';
                    image = cropArray[t].sproutImage;
                }
                else if (((Date.now() - squares[i].timeStamp) * time) < squares[i].maxHarvest) {
                    image = cropArray[t].cropImage;
                    size = 'large';
                }
                else if (((Date.now() - squares[i].timeStamp) * time) > squares[i].maxHarvest) {
                    image = cropArray[t].rotten;
                    size = 'large';
                }
                
            };
                        
        }

        if (cropID === 'empty') {
            image = 'images/none.png';
            size = 'small';
        }
            let currentSquare = document.getElementById(i);
            let cropImage = document.createElement('img');
            if (size === 'small') {
                cropImage.setAttribute('class', 'small-image');
            }
            else if (size === 'large') {
                cropImage.setAttribute('class', 'large-image');
            }
            cropImage.setAttribute('src', image);
            cropImage.setAttribute('id', 'image' + i);
            currentSquare.appendChild(cropImage); 
            currentSquare.setAttribute('class', 'dropdown');    

    }
    

//FORMS
function openForm() {
    document.getElementById('tomato-cost').innerHTML = `Cost: ` + cropArray[1].cost + `,  Yield Time: ` + cropArray[1].minHarvest/oneDay + ` days`;
    document.getElementById('broccoli-cost').innerHTML = `Cost: ` + cropArray[2].cost + `,  Yield Time: ` + cropArray[2].minHarvest/oneDay + ` days`;
    document.getElementById('romaine-cost').innerHTML = `Cost: ` + cropArray[3].cost + `,  Yield Time: ` + cropArray[3].minHarvest/oneDay + ` days`;
    document.getElementById('crop-form').style.display = 'block';
}
// function closeForm() {
//      document.getElementById('close-form').style.display = 'none';
// }
function openCropInfo() { 
   document.getElementById('crop-info').style.display = 'block';
}
function closeCropInfo() {
    document.getElementById('crop-info').style.display = 'none';
}
function openSettings() {
    document.getElementById('settings-form').style.display = 'block';
}
// function closeSettings() {
//     document.getElementById('settings-from').style.display = 'none';
// }
 

//HARVEST A CROP
function harvestOptions() { 
        function findCash() {
            if (squares[selectedID].status === 'Dead') {
                document.getElementById('harvest-cash').style.display = 'none';
            }
            else if (((Date.now() - squares[selectedID].timeStamp) * time) < squares[selectedID].minHarvest) {
                document.getElementById('harvest-cash').style.display = 'none';
            }
            else if (((Date.now() - squares[selectedID].timeStamp) * time) < squares[selectedID].maxHarvest) {
                cashYield = squares[selectedID].age * squares[selectedID].yieldRate;
                document.getElementById('harvest-cash').innerHTML = `Sell for $` + cashYield;
            }
            else if (((Date.now() - squares[selectedID].timeStamp) * time) > squares[selectedID].maxHarvest) {
                document.getElementById('harvest-cash').style.display = 'none';
            }
        };
        
                
        function findCompost() {
            if (((Date.now() - squares[selectedID].timeStamp) * time) < squares[selectedID].minHarvest) {
                compostYield = Math.round(squares[selectedID].age * squares[selectedID].yieldRate); //SOMETHING IS NOT WORKING HERE!!
                document.getElementById('harvest-compost').innerHTML = compostYield + ` lbs compost`;
            }
            else if (((Date.now() - squares[selectedID].timeStamp) * time) < squares[selectedID].maxHarvest) {
                compostYield = Math.round(squares[selectedID].age * squares[selectedID].yieldRate);
                document.getElementById('harvest-compost').innerHTML = compostYield + ` lbs compost`;
            }
            else if (((Date.now() - squares[selectedID].timeStamp) * time) > squares[selectedID].maxHarvest) {
                compostYield = 5;
                document.getElementById('harvest-compost').innerHTML = compostYield + ` lbs compost`;
            }
        };
        
        findCash();
        findCompost();
        document.getElementById('harvest-form').style.display = 'block';

}


//RESET A PLOT
function resetPlot() {
    squares[selectedID].crop = 'empty';
    squares[selectedID].timeStamp = Date.now();
    squares[selectedID].yieldRate = null;
    let JSONplot = JSON.stringify(squares);
    localStorage.setItem('currentSquares', JSONplot);
    
    let img1 = 'image';
    let img2 = selectedID;
    let imgRef = img1.concat(img2);
    
    cropImage = document.getElementById(imgRef);
    cropImage.setAttribute('src', 'images/none.png');

   }


    harvestCash = () => {
        cash = (cash + cashYield); 
        localStorage.setItem('currentCash', cash);
        resetPlot();
     }
    
    function harvestCompost() {
    compost = (compost + compostYield); 
    localStorage.setItem('currentCompost', compost);
    resetPlot();
}

    function closeHarvest() {
     document.getElementById('harvest-form').style.display = 'none';
 }

       
//BUY COMPOST
function buyCompost() {
    if (cash >= 4) {
        cash = cash - 5;
        compost = compost + 10;
        localStorage.setItem('currentCash', cash);
        localStorage.setItem('currentCompost', compost);
        document.location.reload();
    }
    else document.getElementById('res-popup').style.display = 'block';
}

 //PLANT A CROP
function plantCrop(selectedCrop) {
    
    for (i = 0; i < cropArray.length; i++) {
        if (cropArray[i].cropName === selectedCrop) {
            if (cash >= cropArray[i].cost) {
            squares[selectedID].minHarvest = cropArray[i].minHarvest;
            squares[selectedID].maxHarvest = cropArray[i].maxHarvest;
            squares[selectedID].yieldRate = cropArray[i].yieldRate;
            squares[selectedID].crop = selectedCrop;
            squares[selectedID].timeStamp = Date.now();
            squares[selectedID].lastWater = Date.now();
            squares[selectedID].status = null; 
            cash = cash - cropArray[i].cost;
            localStorage.setItem('currentCash', cash)
            JSONplot = JSON.stringify(squares);
            localStorage.setItem('currentSquares', JSONplot);
        }
            else document.getElementById('res-popup').style.display = 'block'; //THIS IS NOT WORKING!
}
        }
    }  
    


waterCrop = () => {
    if (squares[selectedID].hydration > 0) {
        squares[selectedID].lastWater = Date.now();
        JSONplot = JSON.stringify(squares);
        localStorage.setItem('currentSquares', JSONplot);
        document.location.reload();
    }
    else document.getElementById('wat-popup').style.display = 'block';
    
}

//PURCHASE PLOT
document.getElementById('add-plot').addEventListener('click', function(event) {
    if (cash >= 4 && compost >=2) {
    cash = cash - 5;
    compost = compost -2;
    localStorage.setItem('currentCash', cash);
    localStorage.setItem('currentCompost', compost);
    let count = 'plot' + squares.length;
    let newSquare = new Square(count, Date.now(), 'empty');
    squares.push(newSquare);
    let JSONpurchase = JSON.stringify(squares);
    localStorage.setItem('currentSquares', JSONpurchase);
    location.reload();
    }
    else document.getElementById('res-popup').style.display = 'block';
});


//USE COMPOST
document.getElementById('add-compost').addEventListener('mouseenter', function(event) {
    document.getElementById('harvest-popup').style.display = 'block';
});
document.getElementById('add-compost').addEventListener('mouseleave', function(event) {
    document.getElementById('harvest-popup').style.display = 'none';
});

document.getElementById('add-compost').addEventListener('click', function(event) {
    if (compost >= 5) {
        compost = (compost - 5);
        localStorage.setItem('currentCompost', compost);
        document.getElementById('compost-amount').innerHTML = compost;
        squares[selectedID].yieldRate = (squares[selectedID].yieldRate * 1.2);
        let JSONplot = JSON.stringify(squares);
        localStorage.setItem('currentSquares', JSONplot);
        location.reload();
    }  
    else document.getElementById('res-popup').style.display = 'block';

});