import {Button} from "@/components/ui/button.tsx";
import {useNavigate} from "react-router-dom";

const HomePage = () => {

    const navigate = useNavigate();
    const handleProfileClick = () => {
        navigate("/profile/new");
    }
    return (<>
        <h1 className="mx-auto w-full max-w-md">유레카 2기 대나무숲
            <Button variant={"link"} onClick={handleProfileClick}>프로필 만들기</Button>
        </h1>

    </>)
}

export default HomePage;
