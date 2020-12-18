<template>
</template>

<script>
  export default {
    name: "InitBoard",
    methods: {
      drawBoard() {
        let board = function () {
          let cvs = document.getElementById("myCanvas")
          cvs.style.backgroundColor = "#EAC591"
          let context = cvs.getContext("2d")

          let row = 10
          let col = 9

          let line = function (x1, y1, x2, y2) {
            context.beginPath()
            context.moveTo(x1, y1)
            context.lineTo(x2, y2)
            context.strokeStyle = "#756248"
            context.stroke()
            context.closePath()
          }
          //水平
          let horizon = function () {
            for (let i = 0; i < row; i++) {
              line(50, 50 + i * 50, 450, 50 + i * 50)
            }
          }
          //竖直
          let vertical = function () {
            for (let i = 0; i < col; i++) {
              line(50 + i * 50, 50, 50 + i * 50, 500)
            }
          }
          //斜线
          let lean = function () {
            //上方田字
            line(200, 50, 300, 150)
            line(300, 50, 200, 150)
            //  下方田字
            line(200, 400, 300, 500)
            line(300, 400, 200, 500)
          }

          let center = function (x, y) {
            if (x > 0) {
              line(50 + x * 50 - 5, 50 + y * 50 - 5, 50 + x * 50 - 5, 50 + y * 50 - 10)
              line(50 + x * 50 - 5, 50 + y * 50 - 5, 50 + x * 50 - 10, 50 + y * 50 - 5)
              line(50 + x * 50 - 5, 50 + y * 50 + 5, 50 + x * 50 - 10, 50 + y * 50 + 5)
              line(50 + x * 50 - 5, 50 + y * 50 + 5, 50 + x * 50 - 5, 50 + y * 50 + 10)
            }
            if (x < col - 1) {
              line(50 + x * 50 + 5, 50 + y * 50 - 5, 50 + x * 50 + 5, 50 + y * 50 - 10)
              line(50 + x * 50 + 5, 50 + y * 50 - 5, 50 + x * 50 + 10, 50 + y * 50 - 5)
              line(50 + x * 50 + 5, 50 + y * 50 + 5, 50 + x * 50 + 10, 50 + y * 50 + 5)
              line(50 + x * 50 + 5, 50 + y * 50 + 5, 50 + x * 50 + 5, 50 + y * 50 + 10)
            }
          }
          let draw = function () {
            horizon()
            vertical()
            lean()
            //  兵卒炮中心
            center(1, 2)
            center(7, 2)
            center(0, 3)
            center(2, 3)
            center(4, 3)
            center(6, 3)
            center(8, 3)
            center(0, 6)
            center(2, 6)
            center(4, 6)
            center(6, 6)
            center(8, 6)
            center(1, 7)
            center(7, 7)

            //    删除矩形，画出分界(删除放到最后，放在前面效果)
            context.clearRect(51, 251, 398, 48)
          }
          draw()
        }
        board()
      },
    }
  }
</script>

<style scoped>

</style>