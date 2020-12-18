<template>
  <div id="chessboard">
    <canvas id="myCanvas" width="500" height="550" onselectstart="event.returnValue=false" @click="clickCanvas($event)"></canvas><br><br>
    <button @click="restart()">重新开始</button>
  </div>
</template>

<script>
  import InitBoard from "./InitBoard"
  const axios = require('axios').default
  export default {
    name: "Chessboard",
    components:{
      InitBoard,
    },
    data(){
      return{
        chessStatus:"0919293949596979891777062646668600102030405060708012720323436383",
        chessList:[],
        operation:"",
        turn:"red" , //轮到谁
        isOver : false
      }
    },
    methods:{
      clickCanvas(ev) {
        let _this = this
        let cvs = document.getElementById("myCanvas")
        let context = cvs.getContext("2d")

        //每点击一次都要重新画棋盘，不然会出现多个棋子都有点击状态的边框
        context.clearRect(0, 0, 500, 550)
        this.drawChess()
        //点击画布的坐标（浏览器的坐标-画布偏移）
        let x = ev.clientX - cvs.offsetLeft;
        let y = ev.clientY - cvs.offsetTop;
        let x1 = Math.round((x - 50) / 50)
        let y1 = Math.round((y - 50) / 50)
        let r = Math.pow(x - (x1 * 50 + 50), 2) + Math.pow(y - (y1 * 50 + 50), 2)
        this.run(x1,y1,r)
      },
      run (x1,y1,r) {
        if (r <= Math.pow(20, 2)) {
          let i
          for (i = 0; i < this.chessList.length; i++) {  //点击中相应颜色旗子，记录操作
            if (this.chessList[i].x === x1 && this.chessList[i].y === y1 && this.chessList[i].type === this.turn) {
              this.draw(x1, y1)
              this.operation = x1.toString() + y1.toString()
              console.log(this.operation)
              break
            }
          }
          if (i === this.chessList.length) { //没有点击中相应颜色的旗子，那就看上一次是否点中，点中则验证这次走棋是否合法
            if (this.operation !== "") {
              let x2 = parseInt(this.operation.charAt(0))
              let y2 = parseInt(this.operation.charAt(1))
              let j
              for (j = 0; j < this.chessList.length; j++) {
                if (this.chessList[j].x === x2 && this.chessList[j].y === y2 && this.legal(this.chessList[j].name, x2, y2, x1, y1)) {
                  this.operation += x1.toString() + y1.toString()
                  console.log(this.operation)
                  //============发GET请求时：发的状态应该是走之后的
                  //============发POST请求时：发的状态应该是走之前的
                  let tmpOperation = this.operation
                  let tmpChessStatus = this.chessStatus

                   this.fresh(this.operation)

                  //走棋合法，移动相应的棋子
                  if(this.turn === "red"&&!this.isOver){  //轮到黑棋，向api发送请求
                    this.turn = "black"
                    axios.get('/chess/'+ this.chessStatus).then(res=>{
                      if(res.status===200){ //返回成功，刷新棋局状态
                        this.operation = res.data.move
                        this.fresh(this.operation)
                        this.turn = "red"
                      }
                      else if(res.status === 204){
                        this.turn = "black"   //没有返回动作，轮到黑棋下
                      }
                    })
                  }
                  else if(this.turn==='black'){    //玩家手动帮黑棋下，调用api让机器学习动作
                    this.turn = "red"
                  //   //==================请求的格式错了，不能用form data
                  //   // let form = new FormData()
                  //   // form.set('state',this.chessStatus)
                  //   // form.set('move',this.operation)
                    axios.post('/chess/'+tmpChessStatus+'/'+tmpOperation)
                  }
                  else if(this.isOver){
                    this.restart()
                  }
                }
              }
              if (j === this.chessList.length) this.operation = ""
            }
          }
        }
      },
    fresh (move){
      let item =  this.chessStatus
      if(this.isExist(parseInt(move.charAt(2)),parseInt(move.charAt(3)))){
        for(let k=0; k<item.length; k=k+2) {
        //因为前面已经判断过x1,y1不在相应颜色的棋子里，如果现在存在，只能是对方的棋子，即吃掉棋子,将对方棋子置为99
          if(item.charAt(k)===move.charAt(2) && item.charAt(k+1)===move.charAt(3))
          {
            item=item.substring(0,k)+"99"+item.substring(k+2,item.length)
            // console.log(this.chessStatus)
            if(this.chessList[k/2].name === "帅"){
              alert("很遗憾，你输了!")
              this.isOver = true
            }
            else if(this.chessList[k/2].name === "将"){
              alert("恭喜你，你赢了!")
              this.isOver = true
            }
            break
          }
        }
      }
        for(let k=0; k<item.length; k=k+2) {
          if (item.charAt(k) === move.charAt(0) && item.charAt(k + 1) === move.charAt(1)) {
            item = item.substring(0, k) + move.substring(2, 4) + item.substring(k + 2, item.length)
            break
          }
        }
        this.chessStatus = item
        this.operation = ""
        this.chessList = []
        this.drawChess()

    },
      draw(x,y){
        let cvs = document.getElementById("myCanvas")
        let context = cvs.getContext("2d")
        let line = function (x1, y1, x2, y2) {
          context.beginPath()
          context.moveTo(x1, y1)
          context.lineTo(x2, y2)
          context.strokeStyle = "#6858CE"
          context.stroke()
          context.closePath()
        }
          line(50+x*50-20,50+y*50-20,50+x*50-10,50+y*50-20)
          line(50+x*50-20,50+y*50-20,50+x*50-20,50+y*50-10)
          line(50+x*50+20,50+y*50-20,50+x*50+20,50+y*50-10)
          line(50+x*50+20,50+y*50-20,50+x*50+10,50+y*50-20)
          line(50+x*50+20,50+y*50+20,50+x*50+20,50+y*50+10)
          line(50+x*50+20,50+y*50+20,50+x*50+10,50+y*50+20)
          line(50+x*50-20,50+y*50+20,50+x*50-20,50+y*50+10)
          line(50+x*50-20,50+y*50+20,50+x*50-10,50+y*50+20)
      },
      isExist (x,y) {
        for(let j=0; j<this.chessList.length; j++)
        {
          if(this.chessList[j].x===x&&this.chessList[j].y===y)return true
        }
        return false;
      },
      legal (name,x1,y1,x2,y2) {
        let _this = this
        let middle = function(x1,y1,x2,y2) {
          let count = 0
          if(x1===x2){    //车，炮直走
            let max = Math.max(y1,y2)
            let min = Math.min(y1,y2)
            for(let i=min+1; i<max; i++)
            {
              if(_this.isExist(x1,i))count++
            }
          }
          else if(y1===y2){ //车,炮,直走
            let max = Math.max(x1,x2)
            let min = Math.min(x1,x2)
            for(let i=min+1; i<max; i++)
            {
              if(_this.isExist(i,y1))count++
            }
          }
          else if(Math.abs(x1 - x2) === Math.abs(y1 - y2)){ //象，相斜走
            let maxX = Math.max(x1,x2)
            let minX = Math.min(x1,x2)
            let minY = Math.min(y1,y2)
            for(let i = minX+1,j=minY+1; i<maxX ; i++,j++)
              if(_this.isExist(i,j))count++
          }
          else {   //马直走再斜走，判断直走时是否有棋子
            if(x1 - x2 === 2 && _this.isExist(x1-1,y1))count++
            if(x1 - x2 === -2 && _this.isExist(x1+1,y1))count++
            if(y1 - y2 === 2 && _this.isExist(x1,y1-1))count++
            if(y1 - y2 === -2 && _this.isExist(x1,y1+1))count++
          }
          return count
        }
        let isHeader = function (x,y) {
          for(let i=0; i<_this.chessList.length; i++){
            if(_this.chessList[i].x === x && _this.chessList[i].y===y && (_this.chessList[i].name==="帅"||_this.chessList[i].name==="将"))
              return true
          }
          return false
        }
        if(name==="帅")return (((x2>=3&&x2<=5)&&(y2>=7&&y2<=9)&&((Math.abs(x1 - x2) === 1 && Math.abs(y1 - y2) === 0) || (Math.abs(y1 - y2) === 1 && Math.abs(x1 - x2) === 0)))||(isHeader(x2,y2)&&middle(x1,y1,x2,y2)===0) );
        if(name==="将") return (((x2>=3&&x2<=5)&&(y2>=0&&y2<=2)&&((Math.abs(x1 - x2) === 1 && Math.abs(y1 - y2) === 0) || (Math.abs(y1 - y2) === 1 && Math.abs(x1 - x2) === 0))) || (isHeader(x2,y2)&&middle(x1,y1,x2,y2)===0));
        if(name==="士") return ((x2>=3&&x2<=5)&&(y2>=0&&y2<=2)&&(Math.abs(x1 - x2) === 1 && Math.abs(y1 - y2) === 1))
        if(name==="仕") return ((x2>=3&&x2<=5)&&(y2>=7&&y2<=9)&&(Math.abs(x1 - x2) === 1 && Math.abs(y1 - y2) === 1))
        if(name==="相")return ((y2>=5&&y2<=9)&&(Math.abs(x1 - x2) === 2 && Math.abs(y1 - y2) === 2)&&middle(x1,y1,x2,y2)===0)
        if(name==="象")return ((y2>=0&&y2<=4)&&(Math.abs(x1 - x2) === 2 && Math.abs(y1 - y2) === 2)&&middle(x1,y1,x2,y2)===0)
        if(name==="车")return ((x1===x2||y1===y2)&&middle(x1,y1,x2,y2)===0)
        if(name==="炮")return ((x1===x2||y1===y2)&&((middle(x1,y1,x2,y2)===0&&this.isExist(x2,y2)===false)||(middle(x1,y1,x2,y2)===1)&&this.isExist(x2,y2)))
        if(name==="马")return ((Math.abs(x1 - x2) + Math.abs(y1 - y2) === 3)&&middle(x1,y1,x2,y2)===0)
        if(name==="兵")return ((y1>=5&&y1<=6&&y1-y2===1&&x1===x2)||(y1<5&&((y1-y2===1&&x1===x2)||(y1===y2&&Math.abs(x1-x2)===1))))
        if(name==="卒")return ((y1>=3&&y1<=4&&y2-y1===1&&x1===x2)||(y1>4&&(y2-y1===1&&x1===x2||(y1===y2&&Math.abs(x1-x2)===1))))
      },

      chess (x,y,name,type){
        let cvs = document.getElementById("myCanvas")
        let context = cvs.getContext("2d")
        if(x!==9||y!==9){
          context.beginPath()
          context.arc(50+x*50,50+y*50,20,0,Math.PI*2)
          context.fillStyle=type
          context.fill()
          context.closePath()

          context.font="26px bold 宋体"
          context.textAlign="center"
          context.textBaseline="middle"
          context.fillStyle="white"
          context.fillText(name,50+x*50,50+y*50)
        }
      },
      initStatus (str,type,name){
        for(let i=0,j=0; i<str.length; i=i+2,j++)
        {
          this.chessList.push({x:parseInt(str.charAt(i)),y:parseInt(str.charAt(i+1)),name:name[j],type:type})
        }
      },
      drawChess(){
        //点击重新开始，清除画布，用初始数据重新开始渲染画布
        let cvs = document.getElementById("myCanvas")
        let context = cvs.getContext("2d")
        context.clearRect(0,0,500,550)
        InitBoard.methods.drawBoard()

        let red =  this.chessStatus.slice(0,32)
        let black =  this.chessStatus.slice(32,65)
        let name1 = ["车","马","相","仕","帅","仕","相","马","车","炮","炮","兵","兵","兵","兵","兵"]
        let name2 = ["车","马","象","士","将","士","象","马","车","炮","炮","卒","卒","卒","卒","卒"]
        this.chessList = []
        this.initStatus(red,"red",name1)

        this.initStatus(black,"black",name2)
        for(let i=0; i< this.chessList.length; i++)
        {
            this.chess( this.chessList[i].x, this.chessList[i].y, this.chessList[i].name, this.chessList[i].type)
        }
      },
      restart(){
        //重置数据为初始化状态
        this.chessStatus="0919293949596979891777062646668600102030405060708012720323436383"
        this.chessList = []
        this.turn="red"
        this.isOver = false
        this.drawChess()//渲染棋子
      }
      },
     mounted(){
      let _this = this
      //挂载结束后渲染初始状态：主义生命周期的钩子函数中和普通函数的this的区别
       InitBoard.methods.drawBoard()
       _this.drawChess()
      }
  }
</script>

<style scoped>

</style>