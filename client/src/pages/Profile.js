import Breadcrumb from '../components/Breadcrumb';
import cover from '../assets/img/cover-01.png';
import avatar from '../assets/img/avatar.png';
import {useSelector} from "react-redux";
import PopupDialog from "../components/PopupDialog";
import {LuMail} from "react-icons/lu";
import {RiLockPasswordLine} from "react-icons/ri";

const Profile = () => {

    const {user} = useSelector(state => state.auth)
    const userName = user.first_name + ' ' + user.last_name

    return (
        <>
            <Breadcrumb pageName="Mon Profil"/>

            <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default">
                <div className="relative z-20 h-35 md:h-65">
                    <img src={cover}
                         alt="profile cover"
                         className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
                    />
                    <div className="absolute bottom-1 right-1 z-10 xsm:bottom-4 xsm:right-4">
                        <label
                            htmlFor="cover"
                            className="flex cursor-pointer items-center justify-center gap-2 rounded bg-primary py-1 px-2 text-sm font-medium text-white hover:bg-opacity-80 xsm:px-4"
                        >
                            <input type="file" name="cover" id="cover" className="sr-only"/>
                            <span>
                <svg
                    className="fill-current"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4.76464 1.42638C4.87283 1.2641 5.05496 1.16663 5.25 1.16663H8.75C8.94504 1.16663 9.12717 1.2641 9.23536 1.42638L10.2289 2.91663H12.25C12.7141 2.91663 13.1592 3.101 13.4874 3.42919C13.8156 3.75738 14 4.2025 14 4.66663V11.0833C14 11.5474 13.8156 11.9925 13.4874 12.3207C13.1592 12.6489 12.7141 12.8333 12.25 12.8333H1.75C1.28587 12.8333 0.840752 12.6489 0.512563 12.3207C0.184375 11.9925 0 11.5474 0 11.0833V4.66663C0 4.2025 0.184374 3.75738 0.512563 3.42919C0.840752 3.101 1.28587 2.91663 1.75 2.91663H3.77114L4.76464 1.42638ZM5.56219 2.33329L4.5687 3.82353C4.46051 3.98582 4.27837 4.08329 4.08333 4.08329H1.75C1.59529 4.08329 1.44692 4.14475 1.33752 4.25415C1.22812 4.36354 1.16667 4.51192 1.16667 4.66663V11.0833C1.16667 11.238 1.22812 11.3864 1.33752 11.4958C1.44692 11.6052 1.59529 11.6666 1.75 11.6666H12.25C12.4047 11.6666 12.5531 11.6052 12.6625 11.4958C12.7719 11.3864 12.8333 11.238 12.8333 11.0833V4.66663C12.8333 4.51192 12.7719 4.36354 12.6625 4.25415C12.5531 4.14475 12.4047 4.08329 12.25 4.08329H9.91667C9.72163 4.08329 9.53949 3.98582 9.4313 3.82353L8.43781 2.33329H5.56219Z"
                      fill="white"
                  />
                  <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6.99992 5.83329C6.03342 5.83329 5.24992 6.61679 5.24992 7.58329C5.24992 8.54979 6.03342 9.33329 6.99992 9.33329C7.96642 9.33329 8.74992 8.54979 8.74992 7.58329C8.74992 6.61679 7.96642 5.83329 6.99992 5.83329ZM4.08325 7.58329C4.08325 5.97246 5.38909 4.66663 6.99992 4.66663C8.61075 4.66663 9.91659 5.97246 9.91659 7.58329C9.91659 9.19412 8.61075 10.5 6.99992 10.5C5.38909 10.5 4.08325 9.19412 4.08325 7.58329Z"
                      fill="white"
                  />
                </svg>
              </span>
                            <span>Editer</span>
                        </label>
                    </div>
                </div>

                <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
                    <div className="relative z-20 max-h-20">
                        <img
                            className="relative left-[42%] -top-24 max-w-[16%] h-auto rounded-full p-3 bg-white/20 backdrop-blur-[5px]"
                            src={avatar} alt="profile"/>
                        <label
                            htmlFor="profile"
                            className="absolute bottom-6 left-[53%] flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-azure text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2"
                        >
                            <svg
                                className="fill-current"
                                width="14"
                                height="14"
                                viewBox="0 0 14 14"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M4.76464 1.42638C4.87283 1.2641 5.05496 1.16663 5.25 1.16663H8.75C8.94504 1.16663 9.12717 1.2641 9.23536 1.42638L10.2289 2.91663H12.25C12.7141 2.91663 13.1592 3.101 13.4874 3.42919C13.8156 3.75738 14 4.2025 14 4.66663V11.0833C14 11.5474 13.8156 11.9925 13.4874 12.3207C13.1592 12.6489 12.7141 12.8333 12.25 12.8333H1.75C1.28587 12.8333 0.840752 12.6489 0.512563 12.3207C0.184375 11.9925 0 11.5474 0 11.0833V4.66663C0 4.2025 0.184374 3.75738 0.512563 3.42919C0.840752 3.101 1.28587 2.91663 1.75 2.91663H3.77114L4.76464 1.42638ZM5.56219 2.33329L4.5687 3.82353C4.46051 3.98582 4.27837 4.08329 4.08333 4.08329H1.75C1.59529 4.08329 1.44692 4.14475 1.33752 4.25415C1.22812 4.36354 1.16667 4.51192 1.16667 4.66663V11.0833C1.16667 11.238 1.22812 11.3864 1.33752 11.4958C1.44692 11.6052 1.59529 11.6666 1.75 11.6666H12.25C12.4047 11.6666 12.5531 11.6052 12.6625 11.4958C12.7719 11.3864 12.8333 11.238 12.8333 11.0833V4.66663C12.8333 4.51192 12.7719 4.36354 12.6625 4.25415C12.5531 4.14475 12.4047 4.08329 12.25 4.08329H9.91667C9.72163 4.08329 9.53949 3.98582 9.4313 3.82353L8.43781 2.33329H5.56219Z"
                                    fill=""
                                />
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M7.00004 5.83329C6.03354 5.83329 5.25004 6.61679 5.25004 7.58329C5.25004 8.54979 6.03354 9.33329 7.00004 9.33329C7.96654 9.33329 8.75004 8.54979 8.75004 7.58329C8.75004 6.61679 7.96654 5.83329 7.00004 5.83329ZM4.08337 7.58329C4.08337 5.97246 5.38921 4.66663 7.00004 4.66663C8.61087 4.66663 9.91671 5.97246 9.91671 7.58329C9.91671 9.19412 8.61087 10.5 7.00004 10.5C5.38921 10.5 4.08337 9.19412 4.08337 7.58329Z"
                                    fill=""
                                />
                            </svg>
                            <input
                                type="file"
                                name="profile"
                                id="profile"
                                className="sr-only"
                            />
                        </label>
                    </div>

                    <div>
                        <h3 className="mb-1.5 text-2xl font-semibold text-black">
                            {userName}
                        </h3>
                        <p className="font-medium">{user.user_type === "admin" ? "Administrateur" : "Utilisateur"}</p>

                        <div className="flex justify-center mt-8">
                            <div className="py-10 px-20 flex items-center justify-between">
                                <h2 className="font-bold text-black text-xl whitespace-nowrap">
                                    Informations personnelles
                                </h2>
                            </div>

                            <div className="flex">
                                <div className="flex flex-col items-start gap-3.5 py-10 px-20 bg-white rounded-md shadow-default w-full">
                                    <span className="flex items-center gap-x-3">
                                        <LuMail className="text-lg"/>
                                        <h3 className="font-bold">Adresse e-mail : </h3>
                                    </span>
                                        <a className="text-azure ml-8 hover:underline"
                                           href={`mailto:${user.email}`}>{user.email}</a>
                                        <span className="flex items-center gap-x-3">
                                        <RiLockPasswordLine className="text-lg"/>
                                        <h3 className="font-bold">Mot de passe :  </h3>
                                    </span>
                                        <p className="ml-8">********</p>
                                </div>
                                <PopupDialog />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;
