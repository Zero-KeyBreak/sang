import { Component, ReactNode } from "react";
import '../img/logo.png'
import '../css/Logo.css'
class Logo extends Component{
 render(): ReactNode {
     return(
        <div className="logo">
            <div className="logo-img">
                <img src="../src/img/logo.png" alt="" />
            </div>
        </div>
     )
 }
}
export default Logo;