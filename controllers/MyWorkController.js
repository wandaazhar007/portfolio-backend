import path from "path";
import fs from "fs";
import MyWork from "../models/MyWorkModel.js";
import { Op } from "sequelize";

export const getMyWork = async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 4;
  const search = req.query.search_query || "";
  const offset = limit * page;
  const totalRows = await MyWork.count({
    where: {
      [Op.or]: [{
        name: {
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
  const result = await MyWork.findAll({
    attributes: ['id', 'uuid', 'name', 'desc', 'tag', 'preview', 'github', 'type', 'image', 'urlImage', 'license', 'createdAt'],
    where: {
      [Op.or]: [{
        name: {
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

export const getMyWorkById = async (req, res) => {
  const checkId = await MyWork.findOne({
    where: {
      id: req.params.id
    }
  });
  if (!checkId) return res.status(404).json({ msg: "Data not found.." });

  try {
    const response = await MyWork.findOne({
      attributes: ['id', 'uuid', 'name', 'desc', 'tag', 'preview', 'github', 'type', 'image', 'urlImage', 'createdAt'],
      where: {
        id: req.params.id
      }
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(201).json({ msg: error.message });
  }
}

export const createMyWork = async (req, res) => {
  if (req.files === null) return res.status(400).json({ msg: "no file uploaded" });
  const name = req.body.name;
  const desc = req.body.desc;
  const tag = req.body.tag;
  const license = req.body.license;
  const preview = req.body.preview;
  const github = req.body.github;
  const type = req.body.type;
  const image = req.files.image;
  const fileSize = image.data.length;
  // return console.log(image.name);
  const ext = path.extname(image.name);
  const random = Math.floor(Math.random() * 10000);
  const fileName = image.md5 + random + ext;
  // return console.log(fileName);
  const url = `${req.protocol}://${req.get("host")}/images/my-work/${fileName}`;
  const allowedType = ['.png', '.jpg', '.jpeg'];

  if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid Images" });
  if (fileSize > 5000000) return res.status(422).json({ msg: "Image must be less than 5 MB" });

  image.mv(`./public/images/my-work/${fileName}`, async (err) => {
    if (err) return res.status(500).json({ msg: err.message });
    try {
      await MyWork.create({
        name: name,
        desc: desc,
        preview: preview,
        github: github,
        tag: tag,
        license: license,
        type: type,
        image: fileName,
        urlImage: url
      });
      res.status(200).json({ msg: "Work has been saved" });
    } catch (error) {
      if (error) return res.status(500).json({ msg: error.message });
      // res.status(201).json({ msg: error.message });
      // console.log(error.message);
    }
  });

}

export const updateMyWork = async (req, res) => {
  const myWork = await MyWork.findOne({
    where: {
      id: req.params.id
    }
  });
  if (!myWork) return res.status(404).json({ msg: "data not found" });
  let fileName = '';
  if (req.files === null) {
    fileName = myWork.image
  } else {
    const name = req.body.name;
    const desc = req.body.desc;
    const tag = req.body.tag;
    const license = req.body.license;
    const preview = req.body.preview;
    const github = req.body.github;
    const type = req.body.type;
    const image = req.files.image;
    const fileSize = image.data.length;
    const ext = path.extname(image.name);
    const random = Math.floor(Math.random() * 10000);
    const fileName = image.md5 + random + ext;
    const url = `${req.protocol}://${req.get("host")}/images/my-work/${fileName}`;
    const allowedType = ['.png', '.jpg', '.jpeg'];

    if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid Images" });
    if (fileSize > 5000000) return res.status(422).json({ msg: "Image must be less than 5 MB" });

    const filepath = `./public/images/my-work/${myWork.image}`;
    fs.unlinkSync(filepath);
    image.mv(`./public/images/my-work/${fileName}`, (err) => {
      if (err) return res.status(500).json({ msg: err.message });
    });



    try {
      await myWork.update({
        name: name,
        desc: desc,
        preview: preview,
        github: github,
        tag: tag,
        license: license,
        type: type,
        image: fileName,
        urlImage: url
      }, {
        where: {
          id: req.params.id
        }
      });
      res.status(200).json({ msg: "Work has been saved" });
    } catch (error) {
      if (error) return res.status(500).json({ msg: error.message });
    }
  }
}

export const deleteMyWork = async (req, res) => {
  try {
    const myWork = await MyWork.findOne({
      where: {
        id: req.params.id
      }
    });
    if (!myWork) return res.status(404).json({ msg: "Data not found.." });
    const filepath = `./public/images/my-work/${myWork.image}`;
    fs.unlinkSync(filepath);
    await MyWork.destroy({
      where: {
        id: myWork.id
      }
    });
    res.status(200).json({ msg: "Data has been deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}