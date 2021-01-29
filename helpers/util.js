const data=require("../data.json")

function getIdData(id){
        let movieInfo
        for (let i=0;i<data.movies.length;i++) {
            if(Number(id)===data.movies[i].id){
                movieInfo=data.movies[i]
                console.log("内部函数",movieInfo);
                // return movieInfo
                return movieInfo
            }
        }
    }

    
// 暴露函数  为了
module.exports={
    getIdData
}



