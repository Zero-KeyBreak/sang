import { Component, ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";
import '../css/Login.css';
interface Props{

}
interface State {
    username: string;
    password: string;
    isLoggedIn: boolean;
  }
  export interface CurrentUser {
    username: string;
    password: string;
  }
  
class Loginform extends Component<Props,State>{
    constructor(props: Props) {
        super(props);
        const jsonUser: string | null = localStorage.getItem("isLoggedIn");
        const user: CurrentUser = jsonUser !== null && JSON.parse(jsonUser);
    
        this.state = {
          username: "",
          password: "",
          isLoggedIn: user.username === "admin" && user.password === "123",
        };
      }
    handleLogin = () => {
        if (this.state.username === "admin" && this.state.password === "123") {
          const user: CurrentUser = {
            username: this.state.username,
            password: this.state.password,
          };
          console.log(user);
          localStorage.setItem("isLoggedIn", JSON.stringify(user));
          this.setState({ isLoggedIn: true });
          alert("Đăng Nhập Thành Công");
          window.location.reload();
          return;
        }
        alert("Thông tin đăng nhập chưa đúng!");
      };
      UserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
         this.setState({username: e.target.value });
        
        };
        PassInput = (e: React.ChangeEvent<HTMLInputElement>) => {
            this.setState({password: e.target.value });
           
           };
  render(): ReactNode {
    return this.state.isLoggedIn?(
      <Navigate to= {"/page/DoAn"}/>
      ):(<div className="form-sign">
    <p className="form-title">Đăng Nhập Tài Khoản Của Bạn</p>
        <div className="input-container">
          <input 
          type="text" 
          placeholder="Enter Username" 
          value={this.state.username}
          onChange={(e) => this. UserInput(e)}
          />
          <span>
          </span>
      </div>
      <div className="input-container">
          <input 
          type="password" 
          placeholder="Enter Password"
          value={this.state.password}
          onChange={(e) => this. PassInput(e)}

          />
        </div>
         <button type="submit" className="submit" onClick={this.handleLogin}>Đăng Nhập</button>

      <p className="signup-link">
        No account?
        <a href="" className="title-signup">Đăng Ký</a>
      </p>
      <div><Outlet/></div>
      </div>
    )
  }
}
export default Loginform;