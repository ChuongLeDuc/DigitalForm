const express = require("express");
const path=require("path")
const pool=require("../db")
const router = express.Router();

router.get("/users",(req,res)=>{
    const id=req.session.userId
    const fullname=req.session.fullname
    const signname=req.session.signature
    console.log("Lấy user INfor")
    return res.status(200).json({
        success:true,
        fullname:fullname,
        signname:signname
    })
})

router.get("/users/:form_code",async(req,res)=>{
    const form_code=req.params.form_code
    const user_id=req.session.userId

    console.log(form_code,user_id)

    let query=await pool.query(
        `SELECT r.role_code
        FROM form_permissions fp 
        JOIN forms f ON fp.form_id=f.id
        JOIN roles r ON fp.role_id=r.id
        WHERE fp.user_id=$1 AND f.form_code=$2`,[user_id,form_code]
    )

    if(!query.rows.length){
        return res.status(403).json({
            success:false,
            message:"Không tìm thấy quyền của người dùng"
        })
    }else{
        return res.status(200).json({
            success:true,
            message:"Người dùng có thể truy cập",
            roles:query.rows
        })
    }
})

router.get("/forms/:submission_code",async(req,res)=>{
    const submission_code=req.params.submission_code
    console.log("HIHI",submission_code)

    let query=await pool.query(
        `SELECT fs.submission_code,fs.status,creator.fullname, submitter.fullname,fs.data, fs.comment
        FROM form_submission fs 
        JOIN users creator ON fs.created_id=creator.id
        LEFT JOIN users submitter ON fs.submitted_id=submitter.id
        WHERE fs.submission_code=$1`,[submission_code]
    )

    if(!query.rows.length){
        return res.status(200).json({
            success:false,
            message:"Không tìm thấy dữ liệu form",
            exist:false,
            rowData:[]
        })
    }else{
        return res.status(200).json({
            success:false,
            message:"Dữ liệu form đã tồn tại",
            exist:true,
            rowData:query.rows[0]
        })
    }

})

router.get("/forms", async (req, res) => {
    const userID=req.session.userId
    try{
        const query=await pool.query(
            `SELECT f.id, f.form_code, f.form_name, f.version
             FROM form_permissions fp
             JOIN forms f ON f.id=fp.form_id
             WHERE fp.user_id=$1 AND fp.role_id=$2 AND f.is_active=TRUE`,[userID,1]
        )

        if(query.rows.length===0) return res.json({
            message:"Không tìm thấy Form hợp lệ",
            success: true,
            data:[]
        })

        res.status(200).json({
            message:"Lấy form thành công",
            success:true,
            data:query.rows
        })
    }catch(err){
        console.log("Lỗi Server",err)
        res.status(500).json({
            message:"Không thể truy xuất thông tin",
            success: false
        })
    }
});


router.get("/forms/list/AP", async (req, res) => {
    const userID=req.session.userId
    try{
        const query=await pool.query(
            `SELECT fp.form_id, r.role_code,r.id FROM form_permissions fp JOIN roles r ON fp.role_id=r.id
            WHERE fp.user_id=$1 AND r.role_code LIKE '%AP%'`,[userID])

        if(query.rows.length===0) return res.json({
            message:"Không tìm thấy Form hợp lệ",
            success: true,
            data:[]
        })

        let ApproveWaiting=[]
        for(let i=0; i<query.rows.length; i++){
            const row=query.rows[i]
            console.log(row.form_id,row.role_code,row.id)
            const role_query= await pool.query(`
                SELECT r.role_code FROM form_permissions fp JOIN roles r ON fp.role_id=r.id
                WHERE fp.form_id=$1 ORDER BY r.id ASC`,[row.form_id]
            )
            
            const current_role_index=role_query.rows.findIndex(role=>role.role_code===row.role_code)
            let pre_finding=role_query.rows[current_role_index-1].role_code
            console.log("PRE",pre_finding)

            let pre_role
            if(pre_finding==="OP") pre_role="SUBMIT"
            if(pre_finding.includes("AP")) pre_role=pre_finding.replaceAll("AP","APPROVE")
            
            const form= await pool.query(
                `SELECT submission_code,recorded_date,shift,status FROM form_submission WHERE form_id=$1 AND status=$2 ORDER BY id DESC`,[row.form_id,pre_role]
            )

            if(form.rows.length) ApproveWaiting.push(form.rows)
        }
  
        console.log(ApproveWaiting)
        res.status(200).json({
            message:"Lấy form thành công",
            success:true,
            data:ApproveWaiting
        })
    }catch(err){
        console.log("Lỗi Server",err)
        res.status(500).json({
            message:"Không thể truy xuất thông tin",
            success: false
        })
    }
});

router.get("/forms/list/OP", async (req, res) => {
    const userID=req.session.userId
    try{
        const query=await pool.query(
            `SELECT fs.submission_code,fs.recorded_date, fs.shift, fs.status
             FROM form_submission fs
             JOIN form_permissions fp ON fs.form_id=fp.form_id
			 WHERE fp.user_id=$1 AND role_id=$2`,[userID,1]
        )

        if(query.rows.length===0) return res.json({
            message:"Không tìm thấy Form hợp lệ",
            success: true,
            data:[]
        })

        res.status(200).json({
            message:"Lấy form thành công",
            success:true,
            data:query.rows
        })
    }catch(err){
        console.log("Lỗi Server",err)
        res.status(500).json({
            message:"Không thể truy xuất thông tin",
            success: false
        })
    }
});

router.post("/forms",async (req,res)=>{
    const data = req.body.data //dữ liệu JSON
    const form_code=String(req.body.form_code) //H8-FI001-280926-3
    const submit_type=String(req.body.submit_type).split("-")[0].toUpperCase()
    console.log(submit_type)

    const form_code_separation=form_code.split("-")
    const code=form_code_separation[0]+"-"+form_code_separation[1] // H8-FI001`
    const shift=form_code_separation[3]
    const recorded_date=`${form_code_separation[2].slice(0,2)}-${form_code_separation[2].slice(2,4)}-20${form_code_separation[2].slice(4,6)}`

    const uuid=req.body.uuid
    const comment=req.body.comment
    const user_id=req.session.userId

    const check_permission=await pool.query(
        `SELECT r.role_code, fp.user_id
        FROM form_permissions fp JOIN roles r ON fp.role_id=r.id
        JOIN forms f ON fp.form_id=f.id
        WHERE f.form_code=$1`,[code]
    )

    const AP_permission=check_permission.rows.find(row=>row.role_code.includes("AP") && row.user_id==user_id)
    if(submit_type==="APPROVE" || submit_type==="REJECT"){
        const arrangement=["REJECT","SUBMIT","APPROVE-1","APPROVE-2","APPROVE-3","APPROVE-4","APPROVE"]
        if(!AP_permission) return res.status(403).json({
            success:false,
            message:"User không có quyền phê duyệt form"
        })
        
        let to_action="APPROVE-"+AP_permission.role_code.split("-")[1]
        if(AP_permission.role_code==="AP-F") to_action="APPROVE"
        if(submit_type==="REJECT") to_action="REJECT"
        console.log("ROLE: ",AP_permission.role_code, to_action)

        const select= await pool.query('SELECT id,status FROM form_submission WHERE submission_code=$1',[form_code])
        console.log(select,form_code)
        if(!select.rows.length) return res.status(404).json({
            success:false,
            message:"Form không tồn tại"
        })
        const current_status=select.rows[0].status
        console.log(arrangement.indexOf(to_action)-arrangement.indexOf(current_status),"HJKL",to_action,current_status)
        if((to_action!=="APPROVE" && to_action!=="REJECT" && arrangement.indexOf(to_action)-arrangement.indexOf(current_status)!==1) || current_status==="APPROVE") return res.status(403).json({
            success:false,
            message:"Không thể duyệt"
        })

       
        console.log(current_status,to_action)

        const client=await pool.connect()
        try{
            await client.query("BEGIN")
            const update_submission= await client.query(
                `UPDATE form_submission SET status=$1, data=$2, comment=$3
                WHERE submission_code=$4 RETURNING id`,[to_action,data,comment,form_code])
            
            console.log(update_submission)
            if(!update_submission.rowCount) throw new Error("Không thể cập nhật bảng Submission")
            
            const update_approval= await client.query(
                `UPDATE form_approval SET to_action=$1, user_approval_id=$2, approve_at=$3, data=$4, comment=$5
                WHERE form_submission_id=$6 AND to_action IS NULL AND user_approval_id IS NULL`,[to_action,user_id,new Date(),data,comment,update_submission.rows[0].id])
            
            console.log(update_approval)
            if(!update_approval.rowCount) throw new Error("Không thể cập nhật bảng Approval")
            
            if(to_action!=="REJECT" && to_action!=="APPROVE"){
                const insert_approval= await client.query(
                `INSERT INTO form_approval(form_submission_id,from_action,data,comment)
                 VALUES($1,$2,$3,$4)`,[update_submission.rows[0].id,to_action,data,comment])
            
                console.log("sdfghjkl;",insert_approval)
                if(!insert_approval.rowCount) throw new Error("Không thể thêm dữ liệu bảng Approval")
            }

            await client.query("COMMIT")

            return res.status(200).json({
                success:true,
                message:"Cập nhật thành công"
            })
        }catch(err){
            console.log("LÔIssss",err)
            await client.query("ROLLBACK")
            return res.status(500).json({
                success:false,
                message:"Có lối trong quá trình update"
            })
        }finally{
            await client.release()
        }
    }

    const OP_permission=check_permission.rows.find(row=>row.role_code==="OP" && row.user_id==user_id)
    console.log(OP_permission,code)
    if(!OP_permission) return res.status(403).json({
        success:false,
        message:"User không có quyền truy cập form"
    })

    const select= await pool.query('SELECT id,status FROM form_submission WHERE submission_code=$1',[form_code])
    if(select.rows.length){
        console.log("UPDTAE MODE")
        const status =select.rows[0].status
        if(status.startsWith("APPROVE") || (submit_type==="DRAFT" && status!=="DRAFT" && status!=="REJECT")) return res.status(403).json({
            success:false,
            message:"Form không thể chỉnh sửa"
        })

        const client=await pool.connect()
        try{
            await client.query("BEGIN")
            let update_submission
            if(submit_type==="DRAFT"){
                let query_stament=`UPDATE form_submission SET submission_uuid=$1,status=$2, created_id=$3, created_at=$4, data=$5,comment=$6
                                WHERE submission_code=$7 RETURNING id` // Cho Draft
                update_submission= await pool.query(query_stament,[uuid,submit_type,user_id,new Date(),data,comment,form_code])
                if(!update.rowCount) throw new Error("Không thể cập nhật dữ liệu")
            }    
        
            if(submit_type=="SUBMIT"){
                update_submission= await client.query(
                    `UPDATE form_submission SET submission_uuid=$1,status=$2, submitted_id=$3, submitted_at=$4, data=$5, comment=$6
                    WHERE submission_code=$7 RETURNING id`,[uuid,submit_type,user_id,new Date(),data,comment,form_code])
                
                const update_approval= await client.query(
                    `UPDATE form_approval fa SET data=$1, from_action='SUBMIT', comment=$2
                     WHERE id=(
                        SELECT fa.id FROM form_approval fa JOIN form_submission fs
                        ON fa.form_submission_id=fs.id
                        WHERE fs.submission_code=$3
                            AND (fa.from_action='SUBMIT'
                                OR fa.from_action='DRAFT')
                        ORDER BY fa.id DESC
                        LIMIT 1)`,[data,comment,form_code])

                console.log("SUBMISSION",update_submission)
                console.log("APPROVAL",update_approval)
                
                if(!update_submission.rowCount || !update_approval.rowCount) throw new Error("Không thể cập nhật dữ liệu")

            }

            if(status==="REJECT"){
                const insert_approval= await client.query(
                `INSERT INTO form_approval(form_submission_id,from_action,data,comment)
                VALUES($1,$2,$3,$4)`,[update_submission.rows[0].id,submit_type,data,comment])
            
                if(!insert_approval.rowCount) throw new Error("Không thể thêm dữ liệu bảng Approval")
            }
                
                await client.query("COMMIT")

                return res.status(200).json({
                    success:true,
                    message:"Cập nhật thành công"
                })
            }catch(err){
                await client.query("ROLLBACK")
                console.log(err)
                return res.status(500).json({
                    success:false,
                    message:"Có lối trong quá trình update"
                })
            }finally{
                await client.release()
            }

    }else{
        console.log("INSERT MODE")

        //Mặc định là Submit
        let created_at=new Date()
        let created_id=user_id
        let submitted_id=user_id
        let submitted_at=new Date()
        let status =submit_type

        if(submit_type=="DRAFT"){
            created_at=new Date()
            created_id=user_id

            submitted_at=null
            submitted_id=null
        }

        const client=await pool.connect()
        try{
            let to_action=null
            let user_approval_id=null
            let approve_at=null

            if(check_permission.rows.length===1 && check_permission.rows[0].role_code==="OP"){
                to_action="APPROVE"
                user_approval_id=user_id
                approve_at=new Date()
                status="APPROVE"
            }

            await client.query("BEGIN")
            const insert_submission= await client.query(
                `INSERT INTO form_submission(form_id,submission_code,submission_uuid,recorded_date,
                shift,status,created_id,created_at,submitted_id,submitted_at,data,comment)
                SELECT f.id,$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11
                FROM forms f WHERE f.form_code=$12
                RETURNING id`,
                [form_code,uuid,recorded_date,shift,status,created_id,created_at,submitted_id,submitted_at,data,comment,code])
            
            if(!insert_submission.rowCount) throw new Error("Không thể thêm dữ liệu bảng Submission")
            
            if(submit_type=="SUBMIT"){
                const submission_id=insert_submission.rows[0].id
                const insert_approval= await client.query(
                `INSERT INTO form_approval(form_submission_id,from_action,to_action,user_approval_id,approve_at,data,comment)
                 VALUES($1,'SUBMIT',$2,$3,$4,$5,$6)`,[submission_id,to_action,user_approval_id,approve_at,data,comment])
            
                if(!insert_approval.rowCount) throw new Error("Không thể thêm dữ liệu bảng Approval")
            }

            if(submit_type=="DRAFT"){

                const submission_id=insert_submission.rows[0].id
                const insert_approval= await client.query(
                `INSERT INTO form_approval(form_submission_id,from_action,data,comment)
                 VALUES($1,'DRAFT',$2,$3)`,[submission_id,data,comment])
            
                if(!insert_approval.rowCount) throw new Error("Không thể thêm dữ liệu bảng Approval")
                console.log(insert_approval)
            }

            await client.query("COMMIT")

            return res.status(200).json({
                success:true,
                message:"Thêm thành công"
            })
        }catch(err){
            await client.query("ROLLBACK")
            console.log("Lỗi",err)
            return res.status(500).json({
                success:false,
                message:"Có lối trong quá trình Insert"
            })
        }finally{
           await client.release()
        }
    }
})

router.post("/forms/sign/:form_code",async(req,res)=>{

})

module.exports = router;