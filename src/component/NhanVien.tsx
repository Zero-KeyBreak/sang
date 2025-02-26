import { Avatar,Button, Input,Select, Modal, Table, TableColumnsType,message } from "antd";
import { Component } from "react";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Form, } from "antd";
interface Props{}
interface State{
    showModal:boolean,
    email:string,
    name: string;
   
    stock: string;
    brand: string;
    thumbnail: string;
    dataSource: DataType [],
   searchQuery:string,
   isEdit: boolean;
   editIndex: number;
    
}
interface FieldType {
    name: string;
   
    stock: string;
    brand: string;
    thumbnail: string;
    email:string,
  }
interface DataType {
    key: string;
    name: string;
  
    stock: string;
    brand: string;
    thumbnail:string,
    email:string,
  }

export default class DoAN extends Component<Props,State>{
    constructor(props: Props) {
        super(props);
        this.state = {
          showModal: false,
          name: "",
          email:"",
          brand: "Văn Phòng",
        
          stock: "",
          thumbnail: "",
          dataSource:[],
          searchQuery: "",
          isEdit: false,
          editIndex: -1,
        };
      }
      componentDidMount(): void {
        const jsonProducts = localStorage.getItem("Nhân Viên");
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
      handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
          searchQuery: e.target.value,

        });
      }
      
      onFinish = () => {
       
        
        Modal.confirm({
          title: 'Xác nhận thông tin',
          content: (
            <div>
           
              <p><strong>Tên Nhân Viên:</strong> {this.state.name}</p>
              <p><strong>Email:</strong> {this.state.email}</p>
              <p><strong>Số điện thoại:</strong> {this.state.stock}</p>
            
              <p><strong>Văn Phòng:</strong> {this.state.brand}</p>
               
            </div>
          ),
          okText: 'Xác nhận',
          cancelText: 'Hủy bỏ',
          onOk: () => {
        const product: DataType = {
          name: this.state.name,
        
          thumbnail: this.state.thumbnail,
          stock: this.state.stock,
          brand: this.state.brand,
          email:this.state.email,
          key: Date.now().toString(),
        };
        const jsonProducts = localStorage.getItem("Nhân Viên");
    
        if (jsonProducts) {
          const products: DataType[] = JSON.parse(jsonProducts);
          products.unshift(product);
          localStorage.setItem("Nhân Viên", JSON.stringify(products));
          this.setState({
            dataSource: products,
            showModal: false,
          });
         
        }
        else {
          localStorage.setItem("Nhân Viên", JSON.stringify([product]));
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
    content: 'Bạn có chắc chắn muốn xóa nhân viên  này?',
    okText: 'Xóa',
    cancelText: 'Hủy',
    onOk: () => {
      const products: DataType[] = this.state.dataSource;

      const targetIndex = products.findIndex((product) => product.key === key);
      if (targetIndex > -1) {
        products.splice(targetIndex, 1);
        localStorage.setItem("Nhân Viên", JSON.stringify(products));
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
      email:targetProduct.email,
      stock: targetProduct.stock,
     
      brand: targetProduct.brand,
      thumbnail: targetProduct.thumbnail,
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
    email:this.state.email,
    stock: this.state.stock,
   
    brand: this.state.brand,
    thumbnail: this.state.thumbnail,
  };


  products[index] = {
    key: products[index].key,
    ...product,
  };
 localStorage.setItem("Nhân Viên", JSON.stringify(products));
 
  this.setState({
    dataSource: products,
    editIndex: -1,
    showModal: false,
  }, () => {
  
    window.location.reload();
  });
};
handleDetail = (key: string) => {
  const products: DataType[] = this.state.dataSource;
  const targetProduct: DataType | undefined = products.find(
    (item) => item.key === key
  );

  if (targetProduct) {
    Modal.info({
      title: "Xem Chi Tiết Nhân Viên",
      content: (
        <div>
          <p><strong>Tên Nhân Viên:</strong> {targetProduct.name}</p>
          <p><strong>Email:</strong> {targetProduct.email}</p>
          <p><strong>Số Điện Thoại:</strong> {targetProduct.stock}</p>
          <p><strong>Tên Nhân Viên:</strong> {targetProduct.name}</p>
          <p><strong>Văn Phòng:</strong> {targetProduct.brand}</p>
        
          
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
        title:"Mã Nhân Viên",
        dataIndex:"key",
      },
        {
            key:"thumbnail",
            title:"Hình Ảnh Nhân Viên",
            dataIndex:"thumbnail",
            render(value) {
                return <Avatar src={value} size={48} />;
              },
        },
        {
          key: "name",
          title: "Họ và tên",
          dataIndex: "name",
        },
        {
          key:"email",
          title:"Email",
          dataIndex:"email"
        },
        {
            key: "stock",
            title: "Số Điện Thoại",
            dataIndex: "stock",
          
            
          },
          
        {
          key: "brand",
          title: "Văn Phòng ",
          dataIndex: "brand",
          filters: [
            {
              text: "Văn Phòng A",
              value: "Văn Phòng A",
            },
            {
              text: "Văn Phòng B ",
              value: "Văn Phòng B",
            },
            {
              text: "Văn Phòng C",
              value: "Văn Phòng C",
            },
            {
              text: "Văn Phòng D",
              value: "Văn Phòng D",
            },
          ],
          onFilter(value, record) {
            return record.brand.includes(value as string);
          },
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
            
            <Button    style={{width:15}}   onClick={() => {
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
          placeholder="Tìm kiếm nhân viên..."
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
          Tạo Nhân Viên
        </Button>
        
        <Modal
          title={this.state.isEdit ? "Cập nhật Nhân Viên" : "Thêm Nhân Viên"}
          open={this.state.showModal}
          onCancel={this.cancelModal}
          footer={null}
        >
          <Form  onFinish={() => {
              this.state.isEdit ? this.onEdit() : this.onFinish();
            }} autoComplete="off" layout="vertical">
            <Form.Item<FieldType>
              label="Tên Nhân Viên"
              name={"name"}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên nhân viên",
                },
              ]}
            >
              <Input
                placeholder="Tên nhân viên"
                value={this.state.name}
                onChange={(e) =>
                  this.setState({
                    name: e.target.value,
                  })
                }
              />
            </Form.Item>
            <Form.Item<FieldType>
              label="Email"
              name={"email"}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập email của bạn",
                },
              ]}
            >
              <Input
                placeholder="Email của bạn"
                value={this.state.email}
                onChange={(e) =>
                  this.setState({
                    email: e.target.value,
                  })
                }
              />
            </Form.Item>
            <Form.Item<FieldType>
              label="Số điện thoại"
              name={"stock"}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên nhân viên",
                },
              ]}
            >
              <Input
                placeholder="Tên nhân viên"
                value={this.state.stock}
                onChange={(e) =>
                  this.setState({
                    stock: e.target.value,
                  })
                }
              />
            </Form.Item>
           
          

            <Form.Item<FieldType>
              label="Văn Phòng"
              name={"brand"}
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn văn phòng của bạn",
                },
              ]}
            >
              <Select
                defaultValue={this.state.brand}
                onChange={(value) => this.setState({ brand: value })}
              >
                <Select.Option value="Văn Phòng A">Văn Phòng A</Select.Option>
                <Select.Option value="Văn Phòng B">Văn Phòng B</Select.Option>
                <Select.Option value="Văn Phòng C">Văn Phòng C</Select.Option>
                <Select.Option value="Văn Phòng C">Văn Phòng D</Select.Option>
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
        scroll={{ x: 600, y: 400 }}
        />

         
      
        </div>
          )
      }
}
