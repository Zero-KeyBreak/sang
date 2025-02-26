import { Avatar,Button, Input, Modal, Table, TableColumnsType,message } from "antd";
import { Component } from "react";
import { DeleteOutlined, EyeOutlined} from '@ant-design/icons';

interface Props{}
interface State{
    showModal:boolean,
    name: string;
    price: number;
    stock: number;
    brand: string;
    thumbnail: string;
    dataSource: DataType [],
   searchQuery:string,
   isEdit: boolean;
   editIndex: number;
   orderer:string,
   delivery:string,
   status:string,
   isDetail: boolean;
    
}

interface DataType {
    key: string;
    name: string;
    price: number;
    stock: number;
    brand: string;
    thumbnail:string,
    orderer:string,
    delivery:string,
    status:string,
  }

export default class DoAN extends Component<Props,State>{
    constructor(props: Props) {
        super(props);
        this.state = {
          showModal: false,
          name: "",
          brand: "Nhà Cung Cấp",
          price: 0,
          stock: 0,
          thumbnail: "",
          dataSource:[],
          searchQuery: "",
          isEdit: false,
          isDetail:false,
          editIndex: -1,
          orderer:"",
          delivery:"",
          status:"",
        };
      }
      componentDidMount(): void {
        //lấy dữ liệu từ localstorage
        const doan = localStorage.getItem("Đồ Ăn");
    const nuocuong = localStorage.getItem("Nước Uống");
    const monchanmieng = localStorage.getItem("Món Chán Miệng");
    //Tạo Mảng Rỗng Để Lưu Trữ
    let products: DataType[] = [];

    if (doan) {
        products = products.concat(JSON.parse(doan));
    }
    if (nuocuong) {
        products = products.concat(JSON.parse(nuocuong));
    }
    if (monchanmieng) {
        products = products.concat(JSON.parse(monchanmieng));
    }

    this.setState({
        dataSource: products,
    });
      }
      showModal = () => {
        this.setState({
          showModal: true,
        });
      };
    
      cancelModal = () => {
        this.setState({
          showModal: false,
        });
      };
      handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
          searchQuery: e.target.value,

        });
      }
      getRandomStatus = (): string => {
        const statuses = ["Đang Giao", "Chưa Hoàn Thành","Hoàn Thành"];
        return statuses[Math.floor(Math.random() * statuses.length)];
        
      };
      ColorStatus = (status: string) => {
        switch (status) {
          case "Chưa Hoàn Thành":
            return "red";
          case "Đang Giao":
            return "yellow";
          case "Hoàn Thành":
            return "green";
          default:
            return "black";
        }
      };
      
      onFinish = () => {
        

        
       
        const product: DataType = {
          name: this.state.name,
          price: this.state.price,
          thumbnail: this.state.thumbnail,
          stock: this.state.stock,
          brand: this.state.brand,
          orderer:this.state.orderer,
          delivery:this.state.delivery,
          status:this.getRandomStatus(),
          key: Date.now().toString(),
        };
        const products: DataType[] = [...this.state.dataSource, product];

       //Lấy localstorage từ đồ Ăn Nước Uống Mốn Chán Miệng.
        let storageKey = "Đồ Ăn"; 
        if (this.state.brand === "Nhà Hàng A") storageKey = "Nước Uống";
        if (this.state.brand === "Nhà Hàng B") storageKey = "Món Chán Miệng";

        localStorage.setItem(storageKey, JSON.stringify(products));

        this.setState({
            dataSource: products,
            showModal: false,
        });
  };
 onDelete = (key:string) => {
  
  Modal.confirm({
    title: 'Xác nhận xóa',
    content: 'Bạn có chắc chắn muốn xóa sản đơn hàng này?',
    okText: 'Xóa',
    cancelText: 'Hủy',
    onOk: () => {
      const products: DataType[] = this.state.dataSource;

      const targetIndex = products.findIndex((product) => product.key === key);
      if (targetIndex > -1) {
        products.splice(targetIndex, 1);
        localStorage.setItem("Đồ Ăn", JSON.stringify(products));
        localStorage.setItem("Nước Uống", JSON.stringify(products));
        localStorage.setItem("Món Chán Miệng", JSON.stringify(products));
        this.setState({
          dataSource: products,
        });
      }
    },
    onCancel() {
      message.info('Xóa sản phẩm bị hủy');
    }
  });
 };
 //Phương Thức Này Để Hiện Thông Tin Sản Phẩm.
 handleDetail = (key: string) => {
  const products: DataType[] = this.state.dataSource;
  const targetProduct: DataType | undefined = products.find(
    (item) => item.key === key
  );

  if (targetProduct) {
    const TongTien = targetProduct.price * targetProduct.stock;
    Modal.info({
      title: "Xem Chi Tiết Đơn Hàng",
      content: (
        <div>
          <p><strong>Tên sản phẩm:</strong> {targetProduct.name}</p>
          <p><strong>Đơn giá:</strong> {targetProduct.price.toLocaleString()}</p>
          <p><strong>Người Đặt Hàng:</strong> {targetProduct.orderer}</p>
          <p><strong>Người Giao Hàng:</strong> {targetProduct.delivery}</p>
          <p><strong>Số lượng:</strong> {targetProduct.stock}</p>
          <p><strong>Thương hiệu:</strong> {targetProduct.brand}</p>
          <p><strong>Tiến Độ Đơn Hàng:</strong> {targetProduct.status}</p>
          <p><strong>Tổng Tiền:</strong> {TongTien.toLocaleString()}</p>
        </div>
      ),
      okText: 'Đóng',
      onOk() {},
    });
  }
};
      render(){
      
    
    
    const filteredData = this.state.dataSource.filter(item =>
      item.name.toLowerCase().includes(this.state.searchQuery.toLowerCase())||
      item.brand.toLowerCase().includes(this.state.searchQuery.toLowerCase())
     
      
    );
    const columns: TableColumnsType<DataType> = [
      {
        key:"id",
        title:"ID",
        dataIndex:"key",
        width:123,
        
      },
        {
            key:"thumbnail",
            title:"Hình Ảnh Sản Phẩm",
            dataIndex:"thumbnail",
            align:"center",
            width:165,
            render(value) {
                return <Avatar src={value} size={48} />;
              },
        },
        {
          key: "name",
          title: "Tên sản phẩm",
          dataIndex: "name",
          width:125,
        },
        {
          key: "brand",
          title: "Nhà Cung Cấp",
          dataIndex: "brand",
          width:145,
          filters: [
            {
              text: "Nhà Hàng A",
              value: "Nhà Hàng A",
            },
            {
              text: "Nhà Hàng B ",
              value: "Nhà Hàng B",
            },
            {
              text: "Nhà Hàng C",
              value: "Nhà Hàng C",
            },
            {
              text: "Nhà Hàng D",
              value: "Nhà Hàng D",
            },
          ],
          onFilter(value, record) {
            return record.brand.includes(value as string);
          },
        },
        {
          key:"orderer",
          title:"Người Đặt",
          dataIndex:"orderer",
      },
      {
         key:"delivery",
         title:"Người Giao",
         dataIndex:"delivery",
      },
      {
        key:"date",
        title:"Ngày Đặt",
        dataIndex:"date",
        align:"center",
        width:100,
      },
        {
          key: "price",
          title: "Đơn giá",
          dataIndex: "price",
          align:"right",
          sorter:{
            compare: (a,b) => a.price - b.price,
          },
          render(value) {
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      },
        },
        {
          key: "stock",
          title: "Số lượng",
          dataIndex: "stock",
          align:"right",
          sorter:{
            compare: (a,b) => b.stock - a.stock,
          },
        },
       {
        title:"Tổng Tiền",
        align:"right",
        render:(value) =>{
          const TongTien = value.price * value.stock;
          return TongTien.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          
        }
       },
       {
        key:"status",
        title:"Tiến Độ",
        dataIndex:"status",
        render: (status: string) => {
          const color = this.ColorStatus(status);
          return <span style={{ color }}>{status}</span>;
        },
       },
        {
           key:"",
           title:"Hành Động",
           render:(record) =>(
            <>
            <Button style={{width:15,paddingLeft:20}} onClick={() => {
                  this.handleDetail(record.key);
                }}>
            <EyeOutlined   style={{paddingRight:10}} />
            </Button>
            
            <Button   style={{width:15}}   onClick={() => {
                this.onDelete(record.key);
              }}>
            <DeleteOutlined style={{color:'red'}} />
            </Button>
            </>
           )
        },
      ];
          return(
            
            <div>
                <Input
          placeholder="Tìm kiếm đơn hàng..."
          style={{ 
            margin: '16px 0',
            width:400,
            height:40,
            marginLeft:500,
         
            
            
           }}
          value={this.state.searchQuery}
          onChange={(e) => this.handleSearch (e)}
        />
          
               
        
        
        <Table 
        dataSource={filteredData}  
        columns={columns} 
        scroll={{ x: 600, y: 400 }}
        />

         
      
        </div>
          )
      }
}
