import { DatePicker, Form, Input, Select, Upload } from 'antd';
import type { RcFile } from 'antd/lib/upload';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import {
  ChangeEvent,
  ReactElement,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from 'react';
import styled from 'styled-components';

import Button from '~/components/button';
import Layout from '~/components/layout';
import SearchDataList from '~/components/mylogs/searchDataList';
import misc from '~/utils/misc';

import { ReactComponent as SearchIcon } from '../../assets/svgs/magnifier.svg';
import { ReactComponent as CameraIcon } from '../../assets/svgs/mylogCamera.svg';
import { ReactComponent as StarIcon } from '../../assets/svgs/starSolid.svg';

interface AntdFormData {
  memo: string;
  starRating: number;
  hikingDate: {
    _d: Date;
  };
}

const { Option } = Select;

const Create = () => {
  const { data: session } = useSession();
  const [query, setQuery] = useState<string>();
  const [hikingTrailId, setHikingTrailId] = useState<number | null>(null);
  const [files, setFiles] = useState<RcFile[]>([]);
  const deferredQuery = useDeferredValue(query);
  const onChangeQuery = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, []);

  const handleFiles = useCallback((file: RcFile) => {
    setFiles((prev) => prev.concat(file));
    return false;
  }, []);

  const dataList = useMemo(
    () => (
      <SearchDataList
        query={deferredQuery}
        setHikingTrailId={setHikingTrailId}
      />
    ),
    [deferredQuery, setQuery]
  );

  const handleSubmit = async (values: AntdFormData) => {
    if (!hikingTrailId) return;

    try {
      const formData = new FormData();

      files.forEach((file) => formData.append(`imageFiles`, file));
      formData.append('hikingTrailId', hikingTrailId?.toString());
      formData.append('starRating', values.starRating.toString());
      formData.append('memo', values.memo);
      formData.append(
        'hikingDate',
        new Date(values.hikingDate._d).toDateString()
      );

      const response = await axios.post('/server/api/images/temp', formData, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200)
        throw new Error('등산 로그 작성에 실패했습니다.');
    } catch (error) {
      throw new Error(misc.getErrorMessage(error));
    }
  };

  useEffect(() => {
    return () => {
      setHikingTrailId(null);
    };
  }, [session]);

  return (
    <CreateBase>
      <CreateForm onFinish={(value) => handleSubmit(value as AntdFormData)}>
        <CreateItemOutline>
          <SearchIcon id="icon" />
          <CreateFormItem
            name="hikings"
            rules={[
              {
                required: true,
                message: '다녀온 등산로를 선택해주세요.',
              },
            ]}
          >
            <CreateInput
              list="hikings"
              name="hikings"
              value={query}
              onChange={onChangeQuery}
              placeholder="다녀온 등산로를 선택하세요"
            />
            {dataList}
          </CreateFormItem>
        </CreateItemOutline>
        <CreateItemOutline>
          <svg
            id="icon"
            width="18.71"
            height="18.71"
            viewBox="0 0 70 70"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 67.2C0 68.7487 1.25125 70 2.8 70H67.2C68.7487 70 70 68.7487 70 67.2V30.45H0V67.2ZM67.2 6.3H52.5V0.7C52.5 0.315 52.185 0 51.8 0H46.9C46.515 0 46.2 0.315 46.2 0.7V6.3H23.8V0.7C23.8 0.315 23.485 0 23.1 0H18.2C17.815 0 17.5 0.315 17.5 0.7V6.3H2.8C1.25125 6.3 0 7.55125 0 9.1V24.5H70V9.1C70 7.55125 68.7487 6.3 67.2 6.3Z"
              fill="#898A8C"
            />
          </svg>

          <CreateFormItem
            name="hikingDate"
            rules={[
              {
                required: true,
                message: '등산로를 다녀온 날짜를 선택해주세요.',
              },
            ]}
          >
            <CreateDatePicker
              name="hikingDate"
              placeholder="날짜를 선택해주세요"
              suffixIcon={null}
            />
          </CreateFormItem>
        </CreateItemOutline>
        <CreateItemOutline>
          <StarIcon id="icon" />
          <CreateFormItem
            name="starRating"
            rules={[
              {
                required: true,
                message: '다녀온 등산로의 만족도를 평가해주세요.',
              },
            ]}
          >
            <CreateSelect suffixIcon={null} placeholder="만족도를 표시해주세요">
              <CreateOption value={0}>☆ ☆ ☆ ☆ ☆</CreateOption>
              <CreateOption value={1}>★ ☆ ☆ ☆ ☆</CreateOption>
              <CreateOption value={2}>★ ★ ☆ ☆ ☆</CreateOption>
              <CreateOption value={3}>★ ★ ★ ☆ ☆</CreateOption>
              <CreateOption value={4}>★ ★ ★ ★ ☆</CreateOption>
              <CreateOption value={5}>★ ★ ★ ★ ★</CreateOption>
            </CreateSelect>
          </CreateFormItem>
        </CreateItemOutline>
        <CreateItemOutline>
          <CreateFormItem
            name="memo"
            rules={[
              {
                required: true,
                message: '등산로 기록을 작성해주세요.',
              },
            ]}
          >
            <CreateTextArea
              name="memo"
              style={{ height: 212 }}
              placeholder="나만의 등산로그를 기록해 보세요!"
            />
          </CreateFormItem>
        </CreateItemOutline>
        <CreateItemOutline>
          <Upload
            listType="picture-card"
            name="images"
            beforeUpload={handleFiles}
          >
            <div>
              <CameraIcon />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
        </CreateItemOutline>
        <CreateFormItem>
          <Button type="submit">저장하기</Button>
        </CreateFormItem>
      </CreateForm>
    </CreateBase>
  );
};

export default Create;

Create.getLayout = function (page: ReactElement) {
  return <Layout title="등산로그 기록하기">{page}</Layout>;
};

const CreateBase = styled.main`
  padding: 1.688rem 1rem;
`;

const CreateForm = styled(Form)`
  width: 100%;
  .ant-input-affix-wrapper:focus,
  .ant-input-affix-wrapper-focused {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: none;
  }
  .ant-input-status-error:not(.ant-input-disabled):not(.ant-input-borderless).ant-input:focus,
  .ant-input-status-error:not(.ant-input-disabled):not(.ant-input-borderless).ant-input-focused {
    box-shadow: none;
  }
  .ant-input-affix-wrapper-status-error:not(.ant-input-affix-wrapper-disabled):not(.ant-input-affix-wrapper-borderless).ant-input-affix-wrapper:focus,
  .ant-input-affix-wrapper-status-error:not(.ant-input-affix-wrapper-disabled):not(.ant-input-affix-wrapper-borderless).ant-input-affix-wrapper-focused {
    box-shadow: none;
  }
  .ant-form-item-feedback-icon-success {
    color: ${({ theme }) => theme.colors.primary};
  }
  .ant-input {
    font-size: ${({ theme }) => theme.fontSize.m3};
    line-height: 1.563rem;
  }
`;

const CreateFormItem = styled(Form.Item)`
  width: 100%;
  margin: 0;
`;

const CreateItemOutline = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding-bottom: 0.688rem;
  overflow-x: auto;
  width: 100%;
  #icon {
    z-index: 999;
    left: 1.5rem;
    top: 1.125rem;
    position: absolute;
    width: 1.169rem;
    height: 1.169rem;
  }
  fill: ${({ theme }) => theme.colors.gray.dense};
  .ant-select-selection-item {
    color: ${({ theme }) => theme.colors.primary};
  }
  .ant-select-item ant-select-item-option {
    color: ${({ theme }) => theme.colors.primary};
  }
  .ant-select-selector {
    width: 100%;
    height: 3.438rem !important;
    border-radius: 0.625rem !important;
    padding-left: 3.563rem !important;
    display: flex;
    align-items: center;
  }
`;

const CreateInput = styled(Input)`
  border-radius: 0.625rem;
  padding: 0.938rem 0;
  padding-left: 3.563rem;
  font-size: ${({ theme }) => theme.fontSize.r3};
`;

const CreateDatePicker = styled(DatePicker)`
  width: 100%;
  padding: 0;
  border-radius: 0.625rem;

  input {
    padding: 0.938rem 0;
    padding-left: 3.563rem;
    font-size: ${({ theme }) => theme.fontSize.r3};
  }
`;

const CreateSelect = styled(Select)`
  width: 100%;
  border-radius: 0.625rem;

  .ant-select-selection-search {
    width: 100%;
    display: flex;
    align-items: center;
  }

  .ant-select {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const CreateOption = styled(Option)`
  color: ${({ theme }) => theme.colors.primary} !important;
`;

const CreateTextArea = styled(Input.TextArea)`
  width: 100%;
  border-radius: 0.625rem;
  padding: 1.063rem 24px;
`;
