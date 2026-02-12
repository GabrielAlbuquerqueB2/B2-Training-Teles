import "@testing-library/jest-dom"
import {render, screen} from '@testing-library/react'
import AlertMessage from './index.jsx'

describe('Page Header', () => {
    test('Should be visible on alertOpen is true', () => {
        render(<AlertMessage 
            alertOpen={true}
            message="This is an error message"
        />)
        expect(screen.getByText('This is an error message')).toBeDefined()
    })

    test('Should be invisible on alertOpen is false', () => {
        render(<AlertMessage 
            alertOpen={false}
            message="This is an error message"
        />)
        expect(screen.queryByText("This is an error message")).not.toBeInTheDocument()
    })
})