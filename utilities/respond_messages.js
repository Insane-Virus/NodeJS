//2xx success respond codes
const SuccessOK = (res,msg="",result={})=>{
    res.status(200).json({msg,result});
}
const SuccessCreated = (res,msg="",result={})=>{
    res.status(201).json({msg,result});
}
const SuccessAccepted = (res,msg="",result={})=>{
    res.status(202).json({msg,result});
}
const SuccessNoContent = (res,msg="",result={})=>{
    res.status(204).json({msg,result});
}

//4xx client error respond codes
const CEUnauthorized = (res,msg="",result={})=>{
    res.status(401).json({msg,result});
}
const CEBadRequest = (res,msg="",result={})=>{
    res.status(400).json({msg,result});
}
module.exports ={
    SuccessOK,SuccessCreated,SuccessAccepted,SuccessNoContent,
    CEUnauthorized,CEBadRequest
}