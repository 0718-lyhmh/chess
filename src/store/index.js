// import Vue from 'vue'
// import Vuex from 'vuex'
// import axios from "axios"
//
// Vue.use(Vuex)
//
// export default new Vuex.Store({
//   state: {
//     chessStatus:"0919293949596979891777062646668600102030405060708012720323436383",
//     chessList:[],
//     operation:""
//   },
//   mutations: {
//     addChessList(state,item){
//       state.chessList.push(item)
//     },
//     updateChessList(state){
//       Vue.set(state,"chessList",[])
//     },
//     updateOperation(state,move){
//       Vue.set(state,"operation",move)
//     },
//     updateChessStatus(state,chessStatus){
//       Vue.set(state,"chessStatus",chessStatus)
//     },
//   },
//   actions: {
//     send(context,payload) {
//       axios({
//         method: "",
//         url: "",
//         data: {
//           chessStatus: context.state.chessStatus,
//           operation: context.state.operation,
//         }
//       }).then(res => {
//         context.commit("updateChessStatus", res.data)
//       })
//     }
//   },
//   modules: {
//   }
// })
