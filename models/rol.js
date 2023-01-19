import pkg from 'mongoose';
const { Schema, model } = pkg;

const RoleSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    }
});

RoleSchema.methods.toJSON = function() {
    const { __v, _id, ...role } = this.toObject();
    return role;
}

export default model('Role', RoleSchema);