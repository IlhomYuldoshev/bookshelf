import { Link, LinkProps } from '@mui/material';
import { Link as RRouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';

type Props = {
    to: string;
} & RouterLinkProps &
    LinkProps;

const RouterLink = ({ href, ...props }: Props) => {
    return (
        <Link
            component={RRouterLink}
            // @ts-expect-error
            to={href}
            {...props}
        />
    );
};

export default RouterLink;
