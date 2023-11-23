
const CustomInput = () => {
    return (
                <div className="w-2/3 text-center border border-azure rounded-lg py-[1rem] px-2 relative cursor-pointer">
                    <h3 className="text-phlox">Ajouter une Photo / Vidéo</h3>
                    <input className="block h-full w-1/2 absolute top-0 bottom-0 left-0 right-0 opacity-0 cursor-pointer" type="file" />
                </div>
    );
};

export default CustomInput;