const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Usuário já existe" });
    }

    user = new User({ email, password });
    await user.save();

    const token = generateToken(user._id);
    res.status(201).json({ token, email: user.email });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Credenciais inválidas" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Credenciais inválidas" });
    }

    const token = generateToken(user._id);
    res.json({ token, email: user.email });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
};
