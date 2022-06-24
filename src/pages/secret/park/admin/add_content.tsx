import SecretParkLayout from "components/layout/secretParkLayout";
import EditContentForm from "components/secret/park/EditContentForm";
import { NextPage } from "next";
import css from "styles/pages/secret/park/admin/add_content.module.scss"

const AddContent: NextPage = () => {
  return (
    <SecretParkLayout>
      <div>
        <EditContentForm></EditContentForm>
      </div>
    </SecretParkLayout>
  )
}

export default AddContent

export async function getStaticProps() {
  return {
    props: {
    },
  }
}