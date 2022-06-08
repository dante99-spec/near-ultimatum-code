import db from '../models/index'
import CRUDService from '../service/CRUDService'
let getHomePage = async (req, res, next) => {
      try{

      }catch(e){
            console.log(e)
      }
      let data = await db.User.findAll();
      return res. render('homepage.ejs', {
            data: JSON.stringify(data)
      })
}
let getAboutPage = async (req, res, next) => {
      return res.render('test/about.ejs')

}
let getCRUD = async (req, res, next) => {
      return res.render('crud.ejs')
}
let postCRUD =  async (req, res, next) => {
      console.log(req.body)
      let message = await CRUDService.createNewUser(req.body)
      return res.send('post crud from server')
}
let displayGetCRUD = async (req, res, next) => {
      let data = await CRUDService.getAllUser();
      return res.render('displayCRUD.ejs', {
            dataTable: data
      })
}
let getEditCRUD = async (req, res, next) => {
      let userId = req.query.id;
      console.log(userId)
      if (userId){
            let userData = await CRUDService.getUserInfoById(userId);
           
             return res.render('editCRUD.ejs', {
              user: userData
             })
      }
      
      else{
      return res.send('Users not found!')
            
      }
    }
let putCRUD = async (req, res, next) => {
      let data = req.body
      let allUsers = await CRUDService.updateUserData(data)
      return res.render('displayCRUD.ejs', {
            dataTable: allUsers
      })
}
let deleteCRUD = async (req, res) => {
      let id = req.query.id;
      if(id){
            await CRUDService.deleteUserById(id)
            return res.send('Delete user successfully')
      }
      else{
            return res.send('User not found')
      }
     
}
module.exports ={
     getHomePage: getHomePage,
     getAboutPage: getAboutPage,
     getCRUD: getCRUD,
     postCRUD: postCRUD,
     displayGetCRUD: displayGetCRUD,
     getEditCRUD: getEditCRUD,
     putCRUD: putCRUD,
     deleteCRUD: deleteCRUD
}