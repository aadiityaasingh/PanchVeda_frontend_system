import { useForm, useFieldArray } from "react-hook-form";
import { useEffect } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";

import patientData from "../../assets/patientData";
import therapyData from "../../assets/therapyData";

const CreateTherapyPlan = () => {
  const { control, register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      therapies: [
        {
          therapy: "",
          durationDays: "",
          costPerDay: "",
        },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "therapies",
  });

  const therapies = watch("therapies");
  useEffect(() => {
    therapies.forEach((therapy, index) => {
      const selectedTherapy = therapyData.find(
        (item) => item.id === Number(therapy.therapy),
      );

      if (selectedTherapy) {
        setValue(`therapies.${index}.durationDays`, selectedTherapy.duration);

        setValue(`therapies.${index}.costPerDay`, selectedTherapy.cost);
      }
    });
  }, [therapies, setValue]);

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <DashboardLayout>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-xl shadow space-y-5"
      >
        <Select
          label="Patient"
          name="patient"
          register={register}
          options={patientData.map((patient) => ({
            value: patient.id,
            label: patient.fullName,
          }))}
        />

        <div className="grid grid-cols-2 gap-4 mt-5">
          <Input
            label="Start Date"
            type="date"
            name="startDate"
            register={register}
          />

          <Input
            label="End Date"
            type="date"
            name="endDate"
            register={register}
          />
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Therapies</h2>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-4 gap-4 mb-4 items-end"
            >
              <Select
                label="Therapy"
                name={`therapies.${index}.therapy`}
                register={register}
                options={therapyData.map((therapy) => ({
                  value: therapy.id,
                  label: therapy.name,
                }))}
              />

              <Input
                label="Duration"
                type="number"
                name={`therapies.${index}.durationDays`}
                register={register}
              />

              <Input
                label="Cost / Day"
                type="number"
                name={`therapies.${index}.costPerDay`}
                register={register}
              />

              <Button
                type="button"
                variant="danger"
                onClick={() => remove(index)}
              >
                Remove
              </Button>
            </div>
          ))}

          <Button
            type="button"
            onClick={() =>
              append({
                therapy: "",
                durationDays: "",
                costPerDay: "",
              })
            }
          >
            + Add Therapy
          </Button>
        </div>

        <div className="mt-6">
          <Button type="submit">Continue</Button>
        </div>
      </form>
    </DashboardLayout>
  );
};

export default CreateTherapyPlan;
