import styled from 'styled-components'

const Button = styled.button`
  background: transparent;
  border-radius: 3px;
  border: 2px solid ${props => props.color || '#fff'};
  color: ${props => props.color || '#fff'};
  padding: ${props => props.padding || '25px'};
  margin: ${props => props.margin || '20px'};
`

export default Button;
