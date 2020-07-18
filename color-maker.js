
var ColorMaker = {
    getRandomColor:function (){
        var color = "#";
        for(let i=0;i<6;i++){
            color += parseInt(Math.random() *6+10).toString(16);
        }
        return color;
    },

    getComplementarycolor:function ( color){
        let rgb = this.hex2Int(color);
        return this.int2Hex(255- rgb.red,255-rgb.green,255-rgb.blue);
    },

    hex2Int: function (hexcolor){
        let red = parseInt(hexcolor.substr(1,2),16);
        let green = parseInt(hexcolor.substr(3,2),16);
        let blue = parseInt(hexcolor.substr(5,2),16);
        return {red:red, green:green,blue:blue};
    },
    int2Hex: function (red,green,blue){
        let color = "#";
        color+=parseInt(red).toString(16);
        color+=parseInt(green).toString(16);
        color+=parseInt(blue).toString(16);
        return color;
    }

}