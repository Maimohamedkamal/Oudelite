"use client";

import { Button, Input, Modal } from "@heroui/react";
import axios from "axios";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { TokenContext } from "../../Components/Context/TokenContext";

export function EditProfile() {
    let {Token}=useContext(TokenContext)
  const { register, handleSubmit } = useForm();

  async function UploadPhoto(value) {
    try {
      console.log(value);

      const formData = new FormData();

      formData.append("photo", value.photo[0]);

      const response = await axios.put(
        "https://route-posts.routemisr.com/users/upload-photo",
        formData,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );

      console.log(response.data);
    } catch (error) {
      console.log(error.response?.data || error);
    }
  }

  return (
    <Modal>
      <Button variant="secondary">
        Edit Profile
      </Button>

      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-[360px]">

            <Modal.CloseTrigger />

            <Modal.Header>
              <Modal.Heading>
                Edit your profile now!
              </Modal.Heading>
            </Modal.Header>

            <Modal.Body>

              <form onSubmit={handleSubmit(UploadPhoto)}>

                <Input
                  {...register("photo")}
                  type="file"
                  accept="image/*"
                />

                <Button
                  type="submit"
                  className="w-1/2 mt-5 mx-auto"
                  slot="close"
                >
                  Edit
                </Button>

              </form>

            </Modal.Body>

          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}