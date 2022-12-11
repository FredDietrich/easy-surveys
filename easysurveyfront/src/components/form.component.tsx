import { styled } from "@mui/material";
import Box from "@mui/material/Box";

interface IFormProps {
    children: JSX.Element[] | JSX.Element,
    sx?: any,
    marginSm?: string,
    marginMd?: string,
    marginLg?: string
}

export default function Form({ children }: IFormProps) {

    return (
        <form
            style={{marginRight: '25%', marginLeft: '25%'}}
        >
            {children}
        </form>
    )
}