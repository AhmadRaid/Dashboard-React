import SignInForm from './SignInForm'

const SignIn = () => {
    return (
        <>
            <div className="mb-8">
                <h3 className="mb-4"> مرحبا بك في موقع اماني للتصميم والتسويق</h3>
            </div>
            <SignInForm disableSubmit={false} />
        </>
    )
}

export default SignIn
