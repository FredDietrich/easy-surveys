import { styled } from "@mui/material";
import Box from "@mui/material/Box";

interface IFormProps {
    children: JSX.Element[] | JSX.Element,
    sx?: any,
    marginSm?: string,
    marginMd?: string,
    marginLg?: string
}

export default function Form({children, sx, marginSm = '0', marginMd = '10', marginLg = '20'}: IFormProps) {
    const StyledForm = styled(Box)(({ theme }) => ({
        [theme.breakpoints.down('md')]: {
            margin: `0 ${marginSm}% 0 ${marginSm}%`,
        },
        [theme.breakpoints.up('md')]: {
            margin: `1% ${marginMd}% 1% ${marginMd}%`,
        },
        [theme.breakpoints.up('lg')]: {
            margin: `1% ${marginLg}% 1% ${marginLg}%`,
        }
    }));
    return (
        <StyledForm
            component='form'
            alignItems='center'
            sx={sx}
        >
            { children }
        </StyledForm >
    )
}