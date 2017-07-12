/**
 * Created by depengli on 2017/7/11.
 */
/**
 * Created by depengli on 2017/7/5.
 */
var express = require('express');
var router = express.Router();
var config = require('../config');
var User = require('../../model/User');

/* GET users listing. */

function isMail(str) {
    var re = /^([a-za-z0-9]+[_|-|.]?)*[a-za-z0-9]+@([a-za-z0-9]+[_|-|.]?)*[a-za-z0-9]+.[a-za-z]{2,3}$/;
    return re.test(str);
}

router.post('/', function(req, res) {
    var body = req.body;
    var requestJson = body;
    if (typeof body === 'string') {
        requestJson = JSON.parse(body);
    }
    if(isMail(requestJson["username"])){
        requestJson["type"]="email"
    }else{
        requestJson["type"]="phone"
    }

    console.log("----");
    console.log(requestJson);
    if (requestJson["type"]=="phone"){
        User.getUserByPhone(requestJson["phone"],function (result) {
            if(result){
                if (result.password == requestJson["password"]){
                    var token = config.getToken(requestJson["phone"]);
                    var jsonResult = {"success": true,"data":result,token:token};

                    res.json(jsonResult);
                    return;
                }else{
                    var jsonResult = {"success": false,"message":"密码不正确,请重新输入！"};
                    res.json(jsonResult);
                    return;
                }
            }else{
                var jsonResult = {"success": false,"message":"用户名不存在，请先注册！"};
                res.json(jsonResult);
                return;
            }
        });
    }

    if(requestJson["type"]=="email"){
        User.getUserByMail(requestJson["email"],function (result) {
            if(result){
                console.log(result);
                if (result.password == requestJson["password"]){
                    var token = config.getToken(requestJson["phone"]);
                    var jsonResult = {"success": true,"data":result,token:token};

                    res.json(jsonResult);
                    return;
                }else{
                    var jsonResult = {"success": false,"message":"密码不正确,请重新输入！"};
                    res.json(jsonResult);
                    return;
                }
            }else{
                var jsonResult = {"success": false,"message":"用户名不存在，请先注册！"};
                res.json(jsonResult);
                return;
            }
        });
    }


});

module.exports = router;
