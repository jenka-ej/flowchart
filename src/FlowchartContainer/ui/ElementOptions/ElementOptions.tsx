import { Tooltip } from 'antd';
import { colors } from 'app/styles/variables';
import { ERenderLevel, type IApiCamel, type IEntityUnitTemplateCamel, type IFunctionUnitTemplateCamel, type IInputUnitTemplateCamel, type INextUnitCamel, type IPreviousUnitCamel, type IUnitEntityCamel } from 'entities/UnitFieldsConstructor/model/types';
import { PreviewApiRequest, PreviewApiResponse, PreviewEntityRequest, PreviewEntityResponse, PreviewNextUnitVariable, PreviewPreviousUnitVariable, PreviewUnitEntityField, UnitTemplateGroupItems } from 'features/UnitFieldsConstructor/ui';
import { useRef, type ReactNode } from 'react';
import { type TTablerIconOutlinedType } from 'shared/GalileoUIKIT/model/types';
import { TablerIconOutlined } from 'shared/GalileoUIKIT/ui';
import { CloseIcon, FuncIcon, OpenInNewIcon } from 'shared/icons';
import { is } from 'shared/lib';
import { LineLoader } from 'shared/ui';
import { type IElementOptionsProps, type IFlowchartElement } from 'widgets/FlowchartContainer/model/types';
import styles from './ElementOptions.module.scss';

export const ElementOptions = (
  {
    heightScreen,
    currentApp,
    setCurrentOpenedItem,
    optionLoad,
    unitTemplateData,
    clickedItem,
    setShowElementOptions,
  }: IElementOptionsProps,
) => {
  const scrollRef = useRef<null | HTMLDivElement>(null);

  // WILL BE REFACTORED

  const renderPreviewApi = (input: IInputUnitTemplateCamel): ReactNode => (
    <UnitTemplateGroupItems
      key={input.inputId}
      selectedUnitTemplateField={null}
      icon={(
        <TablerIconOutlined
          type="api"
          width={20}
          height={20}
          stroke={colors.error.o}
        />
        )}
      name={(input.data as IApiCamel).api.requestName}
      renderRightContent={() => (
        <div
          className={[
            styles.option__groupItems,
            styles.option__groupItemsApi,
          ].join(' ')}
        >
          <TablerIconOutlined
            type="power"
            stroke={input.runOnStart ? colors.access.active : colors.error.o}
            width={16}
            height={16}
            className={styles.option__groupItemsIcon}
          />
        </div>
      )}
    >
      {(input.data as IApiCamel).apiRequests.map((req, index) => (
        <PreviewApiRequest
          key={req.fieldXApiFieldId}
          apiInfo={input.data as IApiCamel}
          requestInfo={req}
          isOdd={index % 2 === 0}
          selectedUnitTemplateField={null}
          setSelectedUnitTemplateField={() => {}}
        />
      ))}

      {(input.data as IApiCamel).apiResponses.map((res, index) => (
        <PreviewApiResponse
          key={res.apiFieldXFieldId}
          apiInfo={input.data as IApiCamel}
          responseInfo={res}
          isOdd={
              index % 2 === 0
                ? (input.data as IApiCamel).apiRequests.length % 2 === 0
                : !((input.data as IApiCamel).apiRequests.length % 2 === 0)
            }
          selectedUnitTemplateField={null}
          setSelectedUnitTemplateField={() => {}}
        />
      ))}
    </UnitTemplateGroupItems>
  );

  const renderPreviewFunction = (input: IInputUnitTemplateCamel): ReactNode => (
    <UnitTemplateGroupItems
      key={input.inputId}
      selectedUnitTemplateField={null}
      icon={(
        <TablerIconOutlined
          type="math-function"
          width={20}
          height={20}
          stroke="#9351ff"
        />
        )}
      name={input.name}
      renderRightContent={() => (
        <div
          className={[
            styles.option__groupItems,
            styles.option__groupItemsApi,
          ].join(' ')}
        >
          {(input.data as IFunctionUnitTemplateCamel).query && (
          <Tooltip
            title={`Условие: ${(input.data as IFunctionUnitTemplateCamel).query}`}
          >
            <div
              className={styles.option__groupItemsIcon}
              style={{
                width: 16,
                height: 16,
              }}
            >
              <TablerIconOutlined
                type="math-function"
                stroke={colors.bottom.o}
              />
            </div>
          </Tooltip>
          )}

          <TablerIconOutlined
            type="power"
            stroke={input.runOnStart ? colors.access.active : colors.error.o}
            width={16}
            height={16}
            className={styles.option__groupItemsIcon}
          />
        </div>
      )}
      isOpenable={false}
    >
      <></>
    </UnitTemplateGroupItems>
  );

  const renderPreviewUnitEntityQuery = (
    input: IInputUnitTemplateCamel,
  ): ReactNode => (
    <UnitTemplateGroupItems
      key={input.inputId}
      selectedUnitTemplateField={null}
      icon={(
        <TablerIconOutlined
          type="webhook"
          width={20}
          height={20}
          stroke="#dc0276"
        />
        )}
      name={input.name}
      renderRightContent={() => (
        <div
          className={[
            styles.option__groupItems,
            styles.option__groupItemsApi,
          ].join(' ')}
        >
          <TablerIconOutlined
            type="power"
            stroke={input.runOnStart ? colors.access.active : colors.error.o}
            width={16}
            height={16}
            className={styles.option__groupItemsIcon}
          />
        </div>
      )}
    >
      <>
        {(input.data as IEntityUnitTemplateCamel).queryRequests.map(
          (req, index) => (
            <PreviewEntityRequest
              key={req.entityQueryRequestFieldId}
              entityInfo={input.data as IEntityUnitTemplateCamel}
              entityRequestInfo={req}
              isOdd={index % 2 === 0}
              selectedUnitTemplateField={null}
              setSelectedUnitTemplateField={() => {}}
            />
          ),
        )}

        {(input.data as IEntityUnitTemplateCamel).queryResponses.map(
          (res, index) => (
            <PreviewEntityResponse
              key={res.entityQueryResponseFieldId}
              entityInfo={input.data as IEntityUnitTemplateCamel}
              entityResponseInfo={res}
              isOdd={
                  index % 2 === 0
                    ? (input.data as IEntityUnitTemplateCamel).queryRequests
                      .length
                        % 2
                      === 0
                    : !(
                      (input.data as IEntityUnitTemplateCamel).queryRequests
                        .length
                          % 2
                        === 0
                    )
                }
              selectedUnitTemplateField={null}
              setSelectedUnitTemplateField={() => {}}
            />
          ),
        )}
      </>
    </UnitTemplateGroupItems>
  );

  const renderPreviewUnitEntity = (
    input: IInputUnitTemplateCamel,
  ): ReactNode => (
    <UnitTemplateGroupItems
      key={input.inputId}
      selectedUnitTemplateField={null}
      icon={(
        <TablerIconOutlined
          type="database"
          width={20}
          height={20}
          stroke={colors.access.o}
        />
        )}
      name={input.name}
      renderRightContent={() => (
        <div
          className={[
            styles.option__groupItems,
            styles.option__groupItemsApi,
          ].join(' ')}
        >
          <TablerIconOutlined
            type="power"
            stroke={input.runOnStart ? colors.access.active : colors.error.o}
            width={16}
            height={16}
            className={styles.option__groupItemsIcon}
          />
        </div>
      )}
    >
      {(input.data as IUnitEntityCamel).unitEntityFields.map(
        (field, index) => (
          <PreviewUnitEntityField
            key={field.unitEntityFieldId}
            unitEntity={input.data as IUnitEntityCamel}
            unitEntityField={field}
            isOdd={index % 2 === 0}
            selectedUnitTemplateField={null}
            setSelectedUnitTemplateField={() => {}}
          />
        ),
      )}
    </UnitTemplateGroupItems>
  );

  const renderPreviewUnitEntityConnection = (
    input: IInputUnitTemplateCamel,
  ): ReactNode => (
    <UnitTemplateGroupItems
      key={input.inputId}
      selectedUnitTemplateField={null}
      icon={(
        <TablerIconOutlined
          type="cloud-data-connection"
          width={20}
          height={20}
          stroke="#6651ff"
        />
        )}
      name={input.name}
      renderRightContent={() => (
        <div
          className={[
            styles.option__groupItems,
            styles.option__groupItemsApi,
          ].join(' ')}
        >
          <TablerIconOutlined
            type="power"
            stroke={input.runOnStart ? colors.access.active : colors.error.o}
            width={16}
            height={16}
            className={styles.option__groupItemsIcon}
          />
        </div>
      )}
      isOpenable={false}
    >
      <></>
    </UnitTemplateGroupItems>
  );

  const renderPreviewPreviousUnit = (
    previousUnit: IPreviousUnitCamel,
  ): ReactNode => (
    <UnitTemplateGroupItems
      key={previousUnit.unitXUnitTemplateId}
      selectedUnitTemplateField={null}
      icon={(
        <TablerIconOutlined
          type="login"
          width={20}
          height={20}
          stroke={colors.marine.o}
          style={{
            rotate: '180deg',
          }}
        />
        )}
      name={previousUnit.previousUnitTemplateName}
      renderRightContent={() => (
        <div
          className={[
            styles.option__groupItems,
            styles.option__groupItemsNext,
          ].join(' ')}
        >
          <OpenInNewIcon
            onChange={() => {}}
            className={styles.option__groupItemsIcon}
            fill={colors.marine.o}
          />

          {previousUnit.formula && (
          <Tooltip title={`Условие: ${previousUnit.formula}`}>
            <div
              style={{
                width: 16,
                height: 16,
              }}
            >
              <FuncIcon
                className={styles.option__groupItemsNextIcon}
                fill={colors.attention.o}
              />
            </div>
          </Tooltip>
          )}
          <TablerIconOutlined
            type={
                (() => {
                  switch (previousUnit.renderingLevel) {
                    case ERenderLevel.NEXT:
                      return 'fold-up';
                    case ERenderLevel.PREV:
                      return 'fold-down';
                    default:
                      return 'fold';
                  }
                })() as TTablerIconOutlinedType
              }
            stroke={colors.blackMain.o}
            width={16}
            height={16}
            className={styles.option__groupItemsIcon}
          />
        </div>
      )}
    >
      {previousUnit.nextUnitFields.map((field, index) => (
        <PreviewPreviousUnitVariable
          key={field.unitXUnitFieldId}
          previousUnitInfo={previousUnit}
          fieldInfo={field}
          isOdd={index % 2 === 0}
          selectedUnitTemplateField={null}
          setSelectedUnitTemplateField={() => {}}
        />
      ))}
    </UnitTemplateGroupItems>
  );

  const renderPreviewNextUnit = (nextUnit: INextUnitCamel): ReactNode => (
    <UnitTemplateGroupItems
      key={nextUnit.unitXUnitTemplateId}
      selectedUnitTemplateField={null}
      icon={(
        <TablerIconOutlined
          type="login"
          width={20}
          height={20}
          stroke={colors.attention.o}
          style={{
            rotate: '180deg',
          }}
        />
        )}
      name={nextUnit.nextUnitTemplateName}
      renderRightContent={() => (
        <div
          className={[
            styles.option__groupItems,
            styles.option__groupItemsNext,
          ].join(' ')}
        >
          <OpenInNewIcon
            className={styles.option__groupItemsIcon}
            fill={colors.attention.o}
          />

          {nextUnit.formula && (
          <Tooltip title={`Условие: ${nextUnit.formula}`}>
            <div
              className={styles.option__groupItemsIcon}
              style={{
                width: 16,
                height: 16,
              }}
            >
              <FuncIcon fill={colors.bottom.o} />
            </div>
          </Tooltip>
          )}
          <TablerIconOutlined
            type={
                (() => {
                  switch (nextUnit.renderingLevel) {
                    case ERenderLevel.NEXT:
                      return 'fold-up';
                    case ERenderLevel.PREV:
                      return 'fold-down';
                    default:
                      return 'fold';
                  }
                })() as TTablerIconOutlinedType
              }
            stroke={colors.blackMain.o}
            width={16}
            height={16}
            className={styles.option__groupItemsIcon}
          />

          <TablerIconOutlined
            type="trash"
            stroke={colors.blackMain.o}
            width={16}
            height={16}
            className={styles.option__groupItemsIcon}
          />
        </div>
      )}
    >
      {nextUnit.nextUnitFields.map((field, index) => (
        <PreviewNextUnitVariable
          key={field.unitXUnitFieldId}
          nextUnitInfo={nextUnit}
          fieldInfo={field}
          isOdd={index % 2 === 0}
          selectedUnitTemplateField={null}
          setSelectedUnitTemplateField={() => {}}
        />
      ))}
    </UnitTemplateGroupItems>
  );

  // WILL BE REFACTORED

  return (
    <div
      style={{
        width: '900px',
        height: heightScreen - 160,
      }}
      className={styles.option}
    >
      <div
        style={{ overflowY: 'scroll', height: '100%' }}
        ref={scrollRef}
      >
        <div className={styles.option__headerContainer}>
          <h3
            className={styles.option__headerContainer_mainTitle}
            style={{ justifySelf: 'center' }}
          >
            {(clickedItem as IFlowchartElement).elementData.element_name}
          </h3>
          <button
            type="button"
            className={[
              styles.option__button,
              styles.option__button_appearance_white,
            ].join(' ')}
            style={{ justifySelf: 'flex-end' }}
            onClick={() => {
              setShowElementOptions(false);
            }}
          >
            <CloseIcon
              className={[
                styles.option__buttonIcon_appearance_black,
              ].join(' ')}
              width={24}
              height={24}
            />
          </button>
        </div>
        {optionLoad ? (
          <div className={styles.option__loaderContainer}>
            <LineLoader />
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ width: '50%' }}>
              <h3 className={styles.option__title}>{`Входящие данные (${
                unitTemplateData?.inputs?.length
                      || unitTemplateData?.previousUnits?.length
                  ? (unitTemplateData?.inputs?.length || 0)
                          + (unitTemplateData?.previousUnits?.length || 0)
                  : 0
              })`}
              </h3>
              <ul>
                {unitTemplateData
                        && unitTemplateData.inputs.map((input) => (is.num(input.unitApiId) ? (
                          renderPreviewApi(input)
                        ) : is.num(input.unitFunctionId) ? (
                          renderPreviewFunction(input)
                        ) : is.num(input.unitEntityQueryId) ? (
                          renderPreviewUnitEntityQuery(input)
                        ) : is.num(input.unitEntityId) ? (
                          renderPreviewUnitEntity(input)
                        ) : is.num(input.unitEntityConnectionId) ? (
                          renderPreviewUnitEntityConnection(input)
                        ) : (
                          <></>
                        )))}

                {unitTemplateData
                        && unitTemplateData.previousUnits.map((prevUnit) => renderPreviewPreviousUnit(prevUnit))}
              </ul>
            </div>
            <div style={{ width: '1px', backgroundColor: 'grey' }} />
            <div style={{ width: '49%' }}>
              <h3
                className={styles.option__title}
              >{`Выходящие ядра ${unitTemplateData?.nextUnits ? `(${unitTemplateData?.nextUnits.length})` : '(0)'}`}
              </h3>
              <ul>
                {unitTemplateData
                        && unitTemplateData.nextUnits.map((next) => renderPreviewNextUnit(next))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
