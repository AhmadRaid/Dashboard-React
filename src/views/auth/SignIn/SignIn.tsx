import SignInForm from './SignInForm'

const SignIn = () => {
    return (
        <>
            <div className="mb-8">
                <h3 className="mb-1">مرحبًا بعودتك!</h3>
                <p>يرجى إدخال بياناتك الوظيفية لتسجيل الدخول.</p>
            </div>
            <SignInForm disableSubmit={false} />
        </>
    )
}

export default SignIn
