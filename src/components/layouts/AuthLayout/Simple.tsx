import { cloneElement } from 'react'
import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import Logo from '@/components/template/Logo'
import type { ReactNode, ReactElement } from 'react'
import type { CommonProps } from '@/@types/common'

interface SimpleProps extends CommonProps {
    content?: ReactNode
}

const Simple = ({ children, content, ...rest }: SimpleProps) => {
    return (
        <div className="flex items-center justify-center bg-gray-50">
            <Container className="flex flex-col items-center justify-center w-full max-w-md p-6  my-5">
                <Card className="w-full" bodyClass="p-6 md:p-10">
                    <div className="text-center mb-6">
                        <Logo
                            type="streamline"
                            imgClass="w-24 h-24 object-cover mx-auto"
                        />
                    </div>
                    <div className="text-center">
                        {content}
                        {children
                            ? cloneElement(children as ReactElement, {
                                  contentClassName: 'text-center',
                                  ...rest,
                              })
                            : null}
                    </div>
                </Card>
            </Container>
        </div>
    )
}

export default Simple
