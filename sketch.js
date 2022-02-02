const sketch = (s) => {
  let img, colour, offset;

  const randomIntFromInterval = (min, max) =>  { 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  s.setup = () => {
      s.createCanvas(800,800);
      s.pixelDensity(1);
      img = s.loadImage('imgs/1754.jpg');
      s.frameRate(524);
  };

  s.draw = () => {
    //load array
    s.image(img, 0, 0, img.width, img.height);
    
    s.loadPixels();
 

    colour = 100;

    for (let y = 0; y < s.height; y++) {


      for (let x = 0; x < s.width; x++) {

        let pixelIndex = (x + y * s.width)*4;

        if(s.mouseX <= 255){
           s.pixels[pixelIndex + randomIntFromInterval(1,3)-1] = s.mouseX/255*colour;
        }
        else{
          s.pixels[pixelIndex + randomIntFromInterval(1,3)-1] = s.mouseY/255*colour;
        }

        
        
        
      }

    }

    
    
    s.updatePixels();
  }
};
const sketchInstance = new p5(sketch);
