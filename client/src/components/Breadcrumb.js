import { Link } from 'react-router-dom';

const Breadcrumb = ({ pageName }: BreadcrumbProps) => {
    return (
        <div className="my-6 mx-4 flex justify-between gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-bold text-black">
                {pageName}
            </h2>

            <nav className="flex justify-end">
                <ol className="flex items-center gap-2">
                    <li className="font-medium">
                        <Link to="/dashboard">Dashboard /</Link>
                    </li>
                    <li className="text-azure">{pageName}</li>
                </ol>
            </nav>
        </div>
    );
};

export default Breadcrumb;