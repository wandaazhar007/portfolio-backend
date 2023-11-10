import path from "path";
import fs from "fs";
import MyBlog from "../models/MyBlogModel.js";
import Category from "../models/CategoryModel.js";
import { Op } from "sequelize";

export const getMyBlog = async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 4;
  const search = req.query.search_query || "";
  const offset = limit * page;
  const totalRows = await MyBlog.count({
    where: {
      [Op.or]: [{
        title: {
          [Op.like]: '%' + search + '%'
        }
      }, {
        desc: {
          [Op.like]: '%' + search + '%'
        }
      }]
    }
  });
  const totalPage = Math.ceil(totalRows / limit);
  const result = await MyBlog.findAll({
    attributes: ['id', 'uuid', 'title', 'slug', 'desc', 'categoryId', 'link', 'author', 'license', 'image', 'urlImage', 'createdAt'],
    include: [
      {
        model: Category,
        attributes: ['name']
      }
    ],
    where: {
      [Op.or]: [{
        title: {
          [Op.like]: '%' + search + '%'
        }
      }, {
        desc: {
          [Op.like]: '%' + search + '%'
        }
      }]
    },
    offset: offset,
    limit: limit,
    order: [
      ['id', 'DESC']
    ]
  });
  res.json({
    result: result,
    page: page,
    limit: limit,
    totalRows: totalRows,
    totalPage: totalPage
  });
}


export const getButtonCategory = async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const categoryId = req.query.category_id || "";
  const offset = limit * page;
  const totalRows = await MyBlog.count({
    where: {
      categoryId: categoryId
    }
  });
  const totalPage = Math.ceil(totalRows / limit);
  // try {
  const result = await MyBlog.findAll({
    attributes: ['id', 'uuid', 'title', 'slug', 'desc', 'categoryId', 'link', 'author', 'license', 'image', 'urlImage', 'createdAt'],
    include: [
      {
        model: Category,
        attributes: ['name']
      }
    ],
    where: {
      categoryId: categoryId
    },
    offset: offset,
    limit: limit,
    order: [
      ['id', 'DESC']
    ]
  });
  res.json({
    result: result,
    page: page,
    limit: limit,
    totalRows: totalRows,
    totalPage: totalPage
  });
  // } catch (error) {
  //   if (error) return res.status(500).json({ msg: error.message });
  // }
}

export const getAllBlog = async (req, res) => {
  try {
    const response = await MyBlog.findAll();
    res.status(200).json(response)
  } catch (error) {
    res.status({ msg: error.message })
  }
}

export const createBlog = async (req, res) => {
  if (req.files === null) return res.status(400).json({ msg: "No Image Uploaded" });
  const title = req.body.title;
  const slug = req.body.slug;
  const desc = req.body.desc;
  const categoryId = req.body.categoryId;
  const link = req.body.link;
  const author = req.body.author;
  const license = req.body.license;
  const image = req.files.image;
  const fileSize = image.data.length;
  const ext = path.extname(image.name);
  const random = Math.floor(Math.random() * 10000);
  const fileName = image.md5 + random + ext;
  // return console.log(fileName);
  const url = `${req.protocol}://${req.get("host")}/images/my-blog/${fileName}`;
  const allowedType = ['.png', '.jpg', '.jpeg'];

  if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid Images" });
  if (fileSize > 5000000) return res.status(422).json({ msg: "Image must be less than 5 MB" });

  image.mv(`./public/images/my-blog/${fileName}`, async (err) => {
    if (err) return res.status(500).json({ msg: err.message });
    try {
      await MyBlog.create({
        title: title,
        slug: slug,
        desc: desc,
        categoryId: categoryId,
        link: link,
        author: author,
        license: license,
        image: fileName,
        urlImage: url
      });
      res.status(200).json({ msg: "Article has been saved" });
    } catch (error) {
      if (error) return res.status(500).json({ msg: error.message });
      // res.status(201).json({ msg: error.message });
      // console.log(error.message);
    }
  });
}

export const updateMyBlog = async (req, res) => {
  const myblog = await MyBlog.findOne({
    where: {
      id: req.params.id
    }
  });
  // return console.log(product.image);
  if (!myblog) return res.status(404).json({ msg: "data not found" });
  let fileName = "";
  if (req.files === null) {
    fileName = myblog.image;
  } else {
    const image = req.files.image;
    const fileSize = image.data.length;
    const ext = path.extname(image.name);
    const random = Math.floor(Math.random() * 10000);
    const fileName = image.md5 + random + ext;
    const allowedType = ['.png', '.jpg', '.jpeg'];

    if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "invalid image" });
    if (fileSize > 5000000) return res.status(422).json({ msg: " Image must be less then 5Mb" });
    const filepath = `./public/images/my-blog/${myblog.image}`;
    fs.unlinkSync(filepath);
    image.mv(`./public/images/my-blog/${fileName}`, (err) => {
      if (err) return res.status(500).json({ msg: err.message });
    });
  }
  const title = req.body.title;
  const slug = req.body.slug;
  const desc = req.body.desc;
  const categoryId = req.body.categoryId;
  const link = req.body.link;
  const author = req.body.author;
  const license = req.body.license;
  // const license = req.body.license;
  // const fileName = image.md5 + ext;
  const url = `${req.protocol}://${req.get("host")}/images/my-blog/${fileName}`;

  try {
    await MyBlog.update({
      title: title,
      slug: slug,
      desc: desc,
      categoryId: categoryId,
      link: link,
      author: author,
      license: license,
      image: fileName,
      urlImage: url
    }, {
      where: {
        id: req.params.id
      }
    });
    res.status(200).json({ msg: "Success, Article has been updated..." });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}

export const deleteMyBlog = async (req, res) => {
  try {
    const myBlog = await MyBlog.findOne({
      where: {
        id: req.params.id
      }
    });
    if (!myBlog) return res.status(404).json({ msg: "Article not found.." });
    const filepath = `./public/images/my-blog/${myBlog.image}`;
    fs.unlinkSync(filepath);
    await MyBlog.destroy({
      where: {
        id: myBlog.id
      }
    });
    res.status(200).json({ msg: "Article has been deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}