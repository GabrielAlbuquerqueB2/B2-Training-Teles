import "@testing-library/jest-dom"
import {render, screen} from '@testing-library/react'
import PageHeader from './index.jsx'

describe('Page Header', () => {
    test('Should render title', () => {
        render(<PageHeader 
            title="Header"
        />)
        expect(screen.getByText('Header')).toBeDefined()
    })
})