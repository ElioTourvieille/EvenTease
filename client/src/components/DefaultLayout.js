import { Outlet } from 'react-router-dom';
import SideBar from "./SideBar";

const DefaultLayout = () => {

    return (

            <div className="flex h-screen overflow-hidden">

                <SideBar />

                <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">

                    {/* <!-- ===== Main Content Start ===== --> */}
                    <main>
                        <div className="mx-auto max-w-screen-2xl px-10 py-4 md:p-6 2xl:p-10">
                            <Outlet />
                        </div>
                    </main>
                    {/* <!-- ===== Main Content End ===== --> */}
                </div>

            </div>
    );
};

export default DefaultLayout;