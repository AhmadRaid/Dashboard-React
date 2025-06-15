import SignUpForm from './SignUpForm'

const SignUp = () => {
    return (
        <>
            <div className="mb-8">
                <h3 className="mb-1">تسجيل جديد</h3>
                <p>انضم إلينا واكتشف إمكانياتك الكاملة.</p>
            </div>
            <SignUpForm disableSubmit={false} />
        </>
    )
}

export default SignUp
