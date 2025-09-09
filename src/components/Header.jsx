import useAppContext from "../hooks/useAppContext";
import PlusIcon from './PlusIcon'
function Header(props) {

    const showModal = ()=>{
        props.updateModal((state)=>!state)
    }

    const {email, logoutHandle} = useAppContext();
    return (
      <>
        <div className="backdrop-blur-lg bg-matisse-950/20 w-full px-10 py-1 flex justify-between">
          <div className="text-m m-4 text-primary font-light font-sans">
            Email : {email}
          </div>
          <div className="flex justify-around gap-2">
            <button className="submit-button flex justify-between items-center"
            onClick={showModal}
            >
                <PlusIcon className="text-white"/>
                <span className="max-w-max block">Create wallet</span>
            </button>
            <button
              className="submit-button"
              onClick={logoutHandle}
            >
              Logout
            </button>
          </div>
        </div>
      </>
    );
}

export default Header;