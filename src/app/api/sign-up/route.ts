import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs"

export async function POST(request: Request){
    await dbConnect()

    try {
        const {username, email, password} = await request.json()
        const existingUserVerifiedByUsername = await UserModel.findOne({
            // find username which is verified
            username,
            isVerified: true
        })
        if(existingUserVerifiedByUsername){
            return Response.json(
                {
                    success: false,
                    message: "Username already exists."
                },
                {
                    status: 400
                }
            )
        }

        const existingUserByEmail = await UserModel.findOne({email})
        
        // generating verification code
        const verifyCode = Math.floor(100000 + Math.random()* 900000).toString()
        
        if (existingUserByEmail){
            // if user email exists but is not verified
            if(existingUserByEmail.isVerified){
                return Response.json(
                    {
                        status: false,
                        message: "Email already exists."
                    },
                    {
                        status: 500
                    }
                )
            }
            else {
                const hashedPassword = await bcrypt.hash(password,10)
                // saving user password and verify code
                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyToken = verifyCode

                existingUserByEmail.verifyTokenExpiry = new Date(Date.now()+ 3600000)

                await existingUserByEmail.save()

            }


        }
        else{
            // if new user then we register the user details
            
            const hashedPassword = await bcrypt.hash(password,10)
            const expiryDate = new Date()

            // setting expiry to one hour
            expiryDate.setHours(expiryDate.getHours()+1)

            const newUser = new UserModel({    
                username,
                email,
                password: hashedPassword,
                verifyToken: verifyCode,
                verifyTokenExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
 
            })

            await newUser.save()
        }


        // sending verification email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )

        if(!emailResponse.success){
            return Response.json(
                {
                    status: false,
                    message: emailResponse.message
                },
                {
                    status: 500
                }
            )
        }
        
        return Response.json(
            {
                status: true,
                message: "User registered successfully. Please verify your email."
            },
            {
                status: 201
            }
        )


    } catch (error:any) {
        console.log("Error registering user",error);
        return Response.json(
            {
                success: true,
                message: "Error registring user"
            },
            {
                status: 500
            }
        )
    }
}

