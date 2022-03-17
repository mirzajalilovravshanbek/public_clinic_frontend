<template>
  <div class="pl-5 pr-4 py-2">
    <h2 class="text-center m-0">Олтиариқ Тумани</h2>
    <h3 class="text-center m-0">
      {{ doctor_data.doctor != null ? doctor_data.doctor.branch.name : "" }}
    </h3>
    <h4 class="text-center m-0">Амбулатор осмотр доктора</h4>
    <table class="table table-borderless table-md">
      <tbody>
        <tr>
          <th>ФИО:</th>
          <td>{{ patient_data != null ? patient_data.fullname : "" }}</td>
          <th>Год рождения:</th>
          <td>{{ patient_data.birthday | moment }}</td>
        </tr>
        <tr>
          <th>Телефон:</th>
          <td>{{ patient_data.phone != null ? patient_data.phone : "" }}</td>
          <th>Паспорт серии:</th>
          <td>
            {{ patient_data.passport != null ? patient_data.passport : "" }}
          </td>
        </tr>
        <tr>
          <th>Время прибытия:</th>
          <td>{{ created_at | moment }}</td>
          <th>Время выбытия:</th>
          <td>{{ updated_at | moment }}</td>
        </tr>
        <tr>
          <th>Диагноз:</th>
          <td colspan="3">
            {{
              doctor_data.diagnos_name != null
                ? doctor_data.diagnos_name.name
                : ""
            }}
          </td>
        </tr>
        <tr>
          <th>Жалоба Пациента:</th>
          <td colspan="3">{{ doctor_data.complaint }}</td>
        </tr>
        <tr>
          <th>История болезни (Анамнез):</th>
          <td colspan="3">{{ doctor_data.medical_history }}</td>
        </tr>
        <tr>
          <th>Объективный осмотр:</th>
          <td colspan="3">{{ doctor_data.objective_vision }}</td>
        </tr>
        <tr>
          <th>Инструментальные обследование:</th>
          <td colspan="3">{{ doctor_data.instrumental }}</td>
        </tr>
        <tr>
          <th>Лечение:</th>
          <td colspan="3">{{ doctor_data.procedure }}</td>
        </tr>
        <tr>
          <th>Рекомендация:</th>
          <td colspan="3">{{ doctor_data.recommended }}</td>
        </tr>
        <tr>
          <th colspan="2">Врач:</th>
          <th colspan="2">
            {{ doctor_data.doctor != null ? doctor_data.doctor.name : "" }}
          </th>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import moment from "moment";
export default {
  data: () => ({
    patient_data: [],
    doctor_data: [],
    created_at: null,
    updated_at: null
  }),
  mounted() {
    let self = this;
    self.patient_data = JSON.parse(localStorage.getItem("patient"));
    self.doctor_data = JSON.parse(localStorage.getItem("doctor"));
    self.created_at = JSON.parse(localStorage.getItem("created_at"));
    self.updated_at = JSON.parse(localStorage.getItem("updated_at"));
    window.print();
    localStorage.removeItem("patient");
    localStorage.removeItem("doctor");
    localStorage.removeItem("created_at");
    localStorage.removeItem("updated_at");
    setTimeout(() => {
      window.close();
    }, 3000);
  },
  filters: {
    moment: function(date) {
      if (date != null) {
        return moment.unix(date).format("DD.MM.YYYY");
      } else {
        return "";
      }
    }
  }
};
</script>

<style></style>
