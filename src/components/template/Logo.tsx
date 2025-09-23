import classNames from 'classnames'
import { APP_NAME } from '@/constants/app.constant'
import type { CommonProps } from '@/@types/common'
import LogoImage from '@/assets/images/logosm.png'
import LogoImageFull from '@/assets/images/logo.png'
import { Link } from 'react-router-dom' // استيراد Link

interface LogoProps extends CommonProps {
    type?: 'full' | 'streamline'
    mode?: 'light' | 'dark'
    imgClass?: string
    logoWidth?: number | string
}

const Logo = (props: LogoProps) => {
    const {
        type = 'full',
        mode = 'light',
        className,
        imgClass,
        style,
        logoWidth = 'auto',
    } = props

    return (
        <div
            className={classNames('logo', className)}
            style={{
                ...style,
                ...{ width: logoWidth },
            }}
        >
            {' '}
            <Link to="/home-page">
                {' '}
              {' '}
                <img
                    className={imgClass}
                    src={type === 'full' ? LogoImageFull : LogoImage}
                    alt={`${APP_NAME} logo`}
                />
                {' '}
            </Link>
            {' '}
        </div>
    )
}

export default Logo
