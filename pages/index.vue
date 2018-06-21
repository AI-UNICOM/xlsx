<template>
  <el-container>
    <el-header>
      <el-button type="primary" @click="userDialog = true">登录</el-button>
      <el-button type="success" @click="onDropDown">下载</el-button>
      <el-dialog title="输入信息" :visible.sync="userDialog">
        <el-form :model="user">
          <el-form-item label="姓名">
            <el-input v-model="user.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="user.tel" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="工号">
            <el-input v-model="user.no" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="onCloseUser">确 定</el-button>
        </div>
      </el-dialog>
      <div v-show="false" >
        <iframe v-if="downUrl" :src="'http://localhost:3001/'+downUrl" frameborder="0"></iframe>
      </div>
    </el-header>
    <el-main>
      <el-table :data="items" border style="width: 100%">
        <el-table-column prop="a" label="A" width="180">
        </el-table-column>
        <el-table-column prop="b" label="B" width="180">
        </el-table-column>
        <el-table-column prop="c" label="C">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button v-if="scope.row.disabled" @click="onUpdateHandler(scope.row)" type="text" size="small">选择负责人</el-button>
            <el-button v-else type="text" disabled>不可编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="选择负责人" :visible.sync="chioseUserDialog">
        <el-radio-group v-model="fzered">
          <el-radio :key="item.no" :label="item.no" v-for="item in fzer">{{item.name}}</el-radio>
          <el-radio :label="user.no">自己</el-radio>
        </el-radio-group>
        <div slot="footer" class="dialog-footer">
          <el-button @click="chioseUserDialog = false">取 消</el-button>
          <el-button type="primary" @click="onChioseFzer(fzered,selectedId)">确 定</el-button>
        </div>
      </el-dialog>
    </el-main>
  </el-container>
</template>

  <script>
import io from "socket.io-client";

console.log(io);
// var socket = io("ws://192.168.0.105:3001");
export default {
  data() {
    return {
      items: [],
      userDialog: true,
      chioseUserDialog: false,
      user: {
        name: "",
        no: "",
        tel: ""
      },
      fzer: [
        { name: "安甜", no: "14081014", tel: "13451833327" },
        { name: "包振烨", no: "18056400", tel: "15195871926" },
        { name: "李刚", no: "14120589", tel: "18651668225" },
        { name: "李宁", no: "15061251", tel: "13813918412" },
        { name: "马建旭", no: "17101231", tel: "18551603267" },
        { name: "孙一帆", no: "17051101", tel: "18551601718" }
      ],
      fzered: "",
      selectedId: "",
      downUrl: ""
    };
  },
  sockets: {
    connect() {
      console.log("socket connected");
    },
    customEmit(val) {
      console.log(
        'this method was fired by the socket server. eg: io.emit("customEmit", data)'
      );
    }
  },
  methods: {
    onDropDown() {
      this.$socket.emit("C-S-down");
    },
    onCloseUser() {
      this.userDialog = !Object.values(this.user).every(value => !!value);
    },
    onUpdateHandler(item) {
      this.onCloseUser();
      if (!this.userDialog) {
        this.chioseUserDialog = true;
        this.selectedId = item.id;
      }
    },
    onChioseFzer(id, pid) {
      let arrs = this.fzer.concat([this.user]);
      let _arrs = arrs.filter(({ no }) => no == id);
      if (_arrs.length) {
        this.$socket.emit("C-S-update", { id: pid, data: _arrs[0] });
        this.chioseUserDialog = false;
      } else {
        alert("error");
      }
    }
  },
  mounted() {
    this.$socket.emit("C-S-login", { no: "17092879" });
    this.$socket.on("S-C-list", items => {
      this.items = items;
    });
    this.$socket.on("S-C-Url", url => {
      this.downUrl = url;
    });
  }
};
</script>