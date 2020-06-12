export default {
  'POST /upload/images':(req,res)=> {
    res.send({
      header:{code:200},
      body:{
        name:'xxx.png',
        status:'done',
        url:'https://sdf',
      }
    })
  },
}