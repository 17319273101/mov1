// #################响应后台服务#############
// 1.引入包
const express=require("express")
// 引入的模块是个对象的可以尽量解构赋值
const {getIdData}=require("./helpers/util.js")
const port=80

// 随机颜色包
const uniqolor = require('uniqolor');
 
const fs=require("fs")
const bodyParser = require('body-parser')

// 引入json数据
const data=require("./data.json")


// 2.启动服务
const app=express()

// 配置 bodyParser中间件
app.use(bodyParser.urlencoded({ extended: false }))


// 2.5设置ejs路由器
app.set("view engine","ejs")  //不用引入ejs 创建读取功能
app.set("views",__dirname+"/views")  //可以直接读取里边的ejs字符串式的网页 不用再fs读取

//启动静态资源服务??  例如导入data里的img和视频 和html里导入的css都需要这里获取
app.use(express.static(__dirname+"/public"))

// 声明一个获取id找数据的函数  day12把该函数放在一个文件夹里
// function getIdData(id){
//     let movieInfo //???
//     for (let i=0; i < data.movies.length; i++) {
//         if(Number(id)===data.movies[i].id){
//             movieInfo=data.movies[i]
//                 // 找到的就跳出循环体
//             break
//         }   
//     }
//     return movieInfo
// }


// 3.配置路由  get方式电影内容页
app.get("/:id",(request,response)=>{
    // 获取网址的pid占位符参数
    
    let id=request.params.id
    console.log("请求id",id);
    // 输入id值对应的一个电影信息为movieInfo
    let movieInfo=getIdData(id)

    // if(request.url=="123"){
	// 	console.log("执行");
    //       //代表返回响应 
    //     response.end("HAO")
	// }


    response.render("detail",{movieInfo})

})


// get方式电影添加页
app.get("/movies/add",(request,response)=>{
    let data1={}
    response.render("add",data1)
})


// get方式请求电影列表页
app.get("/movies/lists-get",(request,response)=>{
    // 准备数据  所有电影的数组
    let mvarr=data.movies
    // console.log(mvarr,typeof mvarr);
 
    // 对电影空名的进行筛选
    mvarr=mvarr.filter(item=>{
        // 删选条件 记得filter必须带return
        return item.name!=""
    })

    // 对电影标签进行筛选
    if(request.query.tag){
        mvarr=mvarr.filter(item=>{
            return new Set(item.tags).has(request.query.tag)
        })
    }

    // 对搜索输入框进行筛选
    if(request.query.search){
        mvarr=mvarr.filter(item=>{
            return item.name.indexOf(request.query.search)!=-1
        })
    }

    console.log(mvarr);


    // 遍历所有电影标签为集合
    let tagsSet=new Set()
    for (let i= 0; i<mvarr.length; i++) {
        for (let j = 0; j< mvarr[i].tags.length; j++) {
            tagsSet.add(mvarr[i].tags[j])
        }
    }
    console.log(tagsSet);

    response.render("lists",{mvarr,uniqolor,tagsSet})

})



// post方式请求电影列表页
app.post("/movies/lists",(request,response)=>{
    // 分割标签
    request.body.tags = request.body.tags.split(',');
    // 自增id
    // console.log(data.mid,typeof data.mid)
    data.mid++
    let id=data.mid
    
    request.body.id=id


    // POST获取请求体
    console.log("请求体:",request.body);

    // 获取原始数据  追加请求体数据
    data.movies.push(request.body);

    // 写进json里的,必须JSON.stringify(data) 改成json格式
    fs.writeFile("./data.json",JSON.stringify(data),err=>{
        if(err) throw err
    })

    let mvarr=data.movies
    console.log(mvarr,typeof mvarr);

    // 显示电影列表页时 去除名字为空的电影
    mvarr=mvarr.filter(item=>{
        // 删选条件 记得filter必须带return
        return item.name!=""
    })
    response.render("lists",{mvarr,uniqolor})
})

 




// 4.启动服务
app.listen(port,()=>{
    console.log(`${port}服务启动中......`);
})





