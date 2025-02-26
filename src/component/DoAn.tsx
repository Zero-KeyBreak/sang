import { Avatar,Button, Input,Select, Modal, Table, TableColumnsType,message } from "antd";
import { Component } from "react";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Form, } from "antd";
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
   date:string,
    
}
interface FieldType {
    name: string;
    price: number;
    stock: number;
    brand: string;
    thumbnail: string;
    orderer:string,
    delivery:string,
    status:string,
    date:string,
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
    date:string,
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
          editIndex: -1,
          orderer:"",
          delivery:"",
          status:"",
          date:"",
        };
      }
      //Lấy những gì trong localstrorage Đồ Ăn  vào DataType.
      componentDidMount(): void {
        const jsonProducts = localStorage.getItem("Đồ Ăn");
        if (jsonProducts) {
          const products: DataType[] = JSON.parse(jsonProducts);
          this.setState({
            dataSource: products,
          });
          return;
        }
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
      //Để Lấy Giá Trị Trong Thẻ Input
      handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
          searchQuery: e.target.value,

        });
      }
      //Phương Thức Này Random Những Thứ Có Trong Mảng Để Đặt Vào Tiến Độ Giao Hàng.
      getRandomStatus = (): string => {
        const statuses = ["Đang Giao", "Chưa Hoàn Thành","Hoàn Thành"];
        return statuses[Math.floor(Math.random() * statuses.length)];
      };
      //Phương Thức Này Tạo Để Hiện Ngày Đặt Đồ Ăn.
        getDateNow = (): string =>{
          const now = new Date();
          const day = now.getDate();
          const month = now.getMonth()+1;
          const year = now.getFullYear();
          const DateNow = `${day}/${month}/${year}`;
          return DateNow.toString();
         
        }

      onFinish = () => {
         //Phương Thuhcứ Tính Tổng Tiền Khi Đặt Món.
        const TongTien = this.state.price * this.state.stock;
        //Hiện Thông Tin Xác Nhận Tạo Mới Sản Phẩm.
        Modal.confirm({
          title: 'Xác nhận thông tin',
          content: (
            <div>
              <p><strong>Tên sản phẩm:</strong> {this.state.name}</p>
              <p><strong>Người Đặt Hàng:</strong> {this.state.orderer}</p>
              <p><strong>Người Giao Hàng:</strong> {this.state.delivery}</p>
              <p><strong>Ngày Đặt Hàng:</strong> {this.getDateNow()}</p>
              <p><strong>Đơn giá:</strong> {this.state.price}</p>
              <p><strong>Số lượng:</strong> {this.state.stock}</p>
              <p><strong>Nhà Cung Cấp:</strong> {this.state.brand}</p>
              <p><strong>Tổng Tiền:</strong> {TongTien.toLocaleString()}</p>
            </div>
          ),
          okText: 'Xác nhận',
          cancelText: 'Hủy bỏ',
          onOk: () => {
        const product: DataType = {
          name: this.state.name,
          price: this.state.price,
          thumbnail: this.state.thumbnail,
          stock: this.state.stock,
          brand: this.state.brand,
          orderer:this.state.orderer,
          delivery:this.state.delivery,
          status:this.getRandomStatus(),
          date:this.getDateNow(),
          key: Date.now().toString(),
        };
        const jsonProducts = localStorage.getItem("Đồ Ăn");
    
        if (jsonProducts) {
          const products: DataType[] = JSON.parse(jsonProducts);
          products.unshift(product);
          localStorage.setItem("Đồ Ăn", JSON.stringify(products));
         
          this.setState({
            dataSource: products,
            showModal: false,
          });
         
        }
        else {
          localStorage.setItem("Đồ Ăn", JSON.stringify([product]));
          this.setState({
            dataSource: [product],
            showModal: false,
          });
        }
      },
      onCancel() {
        message.info('Tạo sản phẩm bị hủy');
      }
    });
  };
 onDelete = (key:string) => {
  
  Modal.confirm({
    title: 'Xác nhận xóa',
    content: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
    okText: 'Xóa',
    cancelText: 'Hủy',
    onOk: () => {
      const products: DataType[] = this.state.dataSource;

      const targetIndex = products.findIndex((product) => product.key === key);
      if (targetIndex > -1) {
        products.splice(targetIndex, 1);
        localStorage.setItem("Đồ Ăn", JSON.stringify(products));
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
 //Phương Thức Chỉnh Sửa.
 handleEdit = (key: string) => {
  const products: DataType[] = this.state.dataSource;

  let targetIndex = -1;

  const targetProduct: DataType | undefined = products.find((item, index) => {
    if (item.key === key) {
      targetIndex = index;
     
    }
    return item.key === key;
  });

  if (targetProduct && targetIndex > -1) {
    const product = {
      name: targetProduct.name,
      price: targetProduct.price,
      orderer:targetProduct.orderer,
      delivery:targetProduct.delivery,
      stock: targetProduct.stock,
      brand: targetProduct.brand,
      thumbnail: targetProduct.thumbnail,
      status:targetProduct.status,
      date:targetProduct.date,
      
    };

    this.setState({
      ...product,
      isEdit: true,
      editIndex: targetIndex,
      showModal: true,
    });
  }
};

onEdit = () => {
  const index = this.state.editIndex;
  const products: DataType[] = this.state.dataSource;

  const product = {
    name: this.state.name,
    price: this.state.price,
    orderer:this.state.orderer,
    delivery:this.state.delivery,
    stock: this.state.stock,
    brand: this.state.brand,
    thumbnail: this.state.thumbnail,
    status:this.state.status,
    date:this.state.date,

  };


  products[index] = {
    key: products[index].key,
    ...product,
  };
 localStorage.setItem("Đồ Ăn", JSON.stringify(products));
 
  this.setState({
    dataSource: products,
    editIndex: -1,
    showModal: false,
 
  });
};
      render(){
    

    //Phương Thức Tìm Kiếm.
    const filteredData =this.state.dataSource.filter(item =>
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
           key:"",
           title:"Hành Động",
           render:(record) =>(
            <>
            <Button style={{width:15,paddingLeft:20}} onClick={() => {
                  this.handleEdit(record.key);
                }}>
            <EditOutlined   style={{paddingRight:10}} />
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
          placeholder="Tìm kiếm sản phẩm..."
          style={{ 
            margin: '16px 0',
            width:400,
            height:40,
            marginLeft:500,
         
            
            
           }}
          value={this.state.searchQuery}
          onChange={(e) => this.handleSearch (e)}
        />
          
                <Button type="primary" style={{marginLeft:1250,marginTop:-10}} onClick={this.showModal}>
          Tạo sản phẩm
        </Button>
        
        <Modal
          title={this.state.isEdit ? "Cập nhật Sản Phẩm" : "Thêm Sản Phẩm"}
          open={this.state.showModal}
          onCancel={this.cancelModal}
          footer={null}
        >
          <Form  onFinish={() => {
              this.state.isEdit ? this.onEdit() : this.onFinish();
            }} autoComplete="off" layout="vertical">
            <Form.Item<FieldType>
              label="Tên sản phẩm"
              name={"name"}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên sản phẩm",
                },
              ]}
            >
              <Input
                placeholder="Tên sản phẩm"
                value={this.state.name}
                onChange={(e) =>
                  this.setState({
                    name: e.target.value,
                  })
                }
              />
            </Form.Item>

            <Form.Item<FieldType>
              label="Đơn giá"
              name={"price"}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập đơn giá",
                },
              ]}
            >
              <Input
                type="number"
                min={1000}
                placeholder="Đơn giá (VND)"
                value={this.state.price}
                onChange={(e) =>
                  this.setState({
                    price: Number(e.target.value),
                  })
                }
              />
            </Form.Item>
              
            <Form.Item<FieldType>
              label="Người Đặt Hàng"
              name={"orderer"}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập người đặt",
                },
              ]}
            >
              <Input
               
                min={1000}
                placeholder="Người Đặt Hàng"
                value={this.state.orderer}
                onChange={(e) =>
                  this.setState({
                    orderer: e.target.value,
                  })
                }
              />
            </Form.Item>
              
            <Form.Item<FieldType>
              label="Người Giao Hàng"
              name={"delivery"}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập đơn giá",
                },
              ]}
            >
              <Input
               
                min={1000}
                placeholder="Người Giao Hàng"
                value={this.state.delivery}
                onChange={(e) =>
                  this.setState({
                    delivery: e.target.value,
                  })
                }
              />
            </Form.Item>


            <Form.Item<FieldType>
              label="Số lượng"
              name={"stock"}
              rules={[
                {
                  required: true,
                  message: "Vui lòng số lượng sản phẩm",
                },
              ]}
            >
              <Input
                type="number"
                min={0}
                placeholder="Số lượng"
                value={this.state.stock}
                onChange={(e) =>
                  this.setState({
                    stock: Number(e.target.value),
                  })
                }
              />
            </Form.Item>

            <Form.Item<FieldType>
              label="Nhà  Cung Cấp"
              name={"brand"}
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn Nhà Cung Cấp",
                },
              ]}
            >
              <Select
                defaultValue={this.state.brand}
                onChange={(value) => this.setState({ brand: value })}
              >
                <Select.Option value="Nhà Hàng A">Nhà Hàng A</Select.Option>
                <Select.Option value="Nhà Hàng B">Nhà Hàng B</Select.Option>
                <Select.Option value="Nhà Hàng C">Nhà Hàng C</Select.Option>
                <Select.Option value="Nhà Hàng D">Nhà Hàng D</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item<FieldType>
              label="Hình ảnh"
              name={"thumbnail"}
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn hình ảnh",
                },
              ]}
            >
              <Input
                placeholder="https://...."
                value={this.state.thumbnail}
                onChange={(e) =>
                  this.setState({
                    thumbnail: e.target.value,
                  })
                }
              />
            </Form.Item>

            <Form.Item wrapperCol={{ span: 24 }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                style={{ width: "100%" }}
              >
              {this.state.isEdit ? "Cập nhật" : "Tạo mới"}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        <Table 
        dataSource={filteredData}  
        columns={columns} 
        scroll={{ x: 600, y: 400 }} // X là độ dài ngang, là độ dài dọc .
       
        />

         
      
        </div>
          )
      }
}
